import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

// --- CONFIG ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing .env variables!');
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TARGET_GROUPS = [
    'https://www.facebook.com/groups/1685622221742451',
    'https://www.facebook.com/groups/673174389991885',
    'https://www.facebook.com/groups/293555797750114',
];

// Load dynamically discovered groups
try {
    if (fs.existsSync('./scraped_data/discovered_groups.json')) {
        const discovered = JSON.parse(fs.readFileSync('./scraped_data/discovered_groups.json', 'utf-8'));
        // Extract URLs if they are objects, or use strings
        discovered.forEach(g => {
            const url = typeof g === 'string' ? g : g.url;
            if (url && !TARGET_GROUPS.includes(url)) TARGET_GROUPS.push(url);
        });
        console.log(`📚 Loaded ${discovered.length} extra groups from discovery.`);
    }
} catch (e) { console.log('⚠️ Could not load discovered groups:', e.message); }

const MAX_SCROLLS = 30; // ~100 posts check per run
const AI_MODEL = 'gpt-4o'; // Smartest model

// --- UTILS ---
function log(msg) {
    const time = new Date().toISOString();
    console.log(`[${time}] ${msg}`);
    try {
        if (!fs.existsSync('./scraped_data')) fs.mkdirSync('./scraped_data');
        fs.appendFileSync('./scraped_data/ai_agent_log.txt', `[${time}] ${msg}\n`);
    } catch (e) { }
}

function calculateTalentrScore(prof, creat, priceTier, activ) {
    // Normalization to 0-10 scale
    let priceScore = 0.5;
    if (priceTier === 'Mid') priceScore = 0.9;
    if (priceTier === 'High') priceScore = 1.0;
    if (priceTier === 'Premium') priceScore = 0.8;
    if (priceTier === 'Low') priceScore = 0.6;

    const activityScore = (activ || 5) / 10; // Normalize 0-10 -> 0-1

    // Formula: (Prof * 0.4) + (Creat * 0.3) + (Price * 0.2) + (Activity * 0.1)
    // Note: Prof and Creat are 0-10. Price and Activity need to be scaled to 10 for consistency.

    const finalScore = (
        (prof || 5) * 0.4 +
        (creat || 5) * 0.3 +
        (priceScore * 10) * 0.2 +
        (activityScore * 10) * 0.1
    );

    return parseFloat(finalScore.toFixed(1));
}

// --- AI CORE ---
async function analyzeUserProfile(textContext) {
    if (!textContext || textContext.length < 50) return null;

    try {
        const response = await openai.chat.completions.create({
            model: AI_MODEL,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are the Talentr AI Agent. Analyze text from Facebook groups to find event professionals.

STRICT JSON OUTPUT ONLY. NO MARKDOWN.

Task:
1. Identify if this is a Talent offer (DJ, Photo, etc). Ignore "Looking for X".
2. Extract details.
3. Score the talent (0-10).

Schema:
{
    "is_talent": boolean,
    "name": "string (or Unknown)",
    "profession": "string",
    "sub_category": "string",
    "gender": "male/female/unknown",
    "age_range": "18-25/26-35/36-45/45+/unknown",
    "location": "string",
    "price_tier": "Low/Mid/High/Premium",
    "professionalism_score": number (0-10),
    "creativity_score": number (0-10),
    "activity_level": number (0-10),
    "confidence": number (0-100),
    "contacts": {
        "phone": "string or null",
        "instagram": "string or null",
        "whatsapp": "string or null",
        "email": "string or null"
    },
    "summary": "string"
}`
                },
                { role: 'user', content: `Analyze this post content:\n---\n${textContext.slice(0, 2000)}\n---` }
            ],
            temperature: 0.1,
        });

        const result = JSON.parse(response.choices[0].message.content);
        return result;
    } catch (e) {
        log(`AI Error: ${e.message}`);
        return null;
    }
}

// --- MAIN ---
async function main() {
    log('\n🤖 Talentr AI Agent v1.0 Launching...');

    const browser = await chromium.launchPersistentContext(
        './browser_data',
        {
            headless: false,
            viewport: { width: 1280, height: 800 },
            args: ['--disable-blink-features=AutomationControlled']
        }
    );

    const page = await browser.newPage();

    // Verify Login
    log('Checking login...');
    await page.goto('https://www.facebook.com');
    await page.waitForTimeout(3000);

    // Simple check: if login input exists, we are not logged in
    if (await page.$('input[name="email"]')) {
        log('❌ Not logged in! Please login manually in the browser window.');
        // Don't close immediately, give user chance (or just exit)
        // actually for automation, we fail.
        await browser.close();
        return;
    }
    log('✅ Login OK.');

    // Crawl Groups
    for (const groupUrl of TARGET_GROUPS) {
        log(`\n🔍 Entering Group: ${groupUrl}`);
        try {
            await page.goto(groupUrl, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(5000);

            let scrolls = 0;
            const processedTexts = new Set(); // Simple session dedup

            while (scrolls < MAX_SCROLLS) {
                // Get articles
                const articles = await page.$$('div[role="article"]');
                log(`   Found ${articles.length} posts visible...`);

                for (const article of articles) {
                    try {
                        const text = await article.innerText();

                        // Dedup (simple hash-like)
                        const signature = text.slice(0, 50);
                        if (processedTexts.has(signature)) continue;
                        processedTexts.add(signature);

                        if (text.length < 50) continue;

                        // AI Analysis
                        log(`   🧠 Analyzing... (${text.slice(0, 30)}...)`);
                        const analysis = await analyzeUserProfile(text);

                        if (analysis && analysis.is_talent && analysis.confidence > 60) {

                            // Check uniqueness in DB (by phone/insta)
                            // If no contact info, we might skip to avoid pollution, or store as "Lead"
                            const contactKey = analysis.contacts.phone || analysis.contacts.instagram || analysis.contacts.email;

                            if (!contactKey) {
                                log(`   ⚠️ Skipped: No contact info.`);
                                continue;
                            }

                            // Calculate Score
                            const tScore = calculateTalentrScore(
                                analysis.professionalism_score,
                                analysis.creativity_score,
                                analysis.price_tier,
                                analysis.activity_level
                            );

                            // Insert
                            const { error } = await supabase
                                .from('pending_vendors')
                                .insert({
                                    name: analysis.name || 'Talent',
                                    category: analysis.profession,
                                    status: 'pending',
                                    source_type: 'facebook_ai',
                                    source_url: groupUrl,
                                    description: text.slice(0, 500), // Original text sample
                                    phone: analysis.contacts.phone,
                                    email: analysis.contacts.email,
                                    instagram_handle: analysis.contacts.instagram,
                                    source_data: {
                                        ai_analysis: analysis,
                                        talentr_score: tScore,
                                        raw_text: text,
                                        crawled_at: new Date().toISOString()
                                    },
                                    // Add these if columns exist, otherwise source_data handles it
                                    // We rely on source_data mostly now as per plan
                                });

                            if (!error) {
                                log(`   💎 SAVED: ${analysis.name} (${analysis.profession}) | Score: ${tScore}`);
                            } else {
                                if (error.code === '23505') log(`   💤 Duplicate in DB`);
                                else log(`   ⚠️ DB Error: ${error.message}`);
                            }

                        } else {
                            // log(`   🗑️ Ignored`);
                        }

                    } catch (err) {
                        // console.error(err);
                    }
                }

                // Scroll
                await page.evaluate(() => window.scrollBy(0, 1000));
                await page.waitForTimeout(2000 + Math.random() * 2000);
                scrolls++;
            }

        } catch (e) {
            log(`❌ Group Error: ${e.message}`);
        }
    }

    log('🏁 Done.');
    await browser.close();
}

main().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

// Config
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing .env variables!');
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function log(msg) {
    console.log(msg);
}

function calculateTalentrScore(prof, creat, priceTier, activ) {
    let priceScore = 0.5;
    if (priceTier === 'Mid') priceScore = 0.9;
    if (priceTier === 'High') priceScore = 1.0;
    if (priceTier === 'Premium') priceScore = 0.8;
    if (priceTier === 'Low') priceScore = 0.6;

    const activityScore = (activ || 5) / 10;

    const finalScore = (
        (prof || 5) * 0.4 +
        (creat || 5) * 0.3 +
        (priceScore * 10) * 0.2 +
        (activityScore * 10) * 0.1
    );

    return parseFloat(finalScore.toFixed(1));
}

async function analyzeVendor(vendor) {
    const context = `Name: ${vendor.name}\nCategory: ${vendor.category}\nDescription: ${vendor.description || ''}\nCity: ${vendor.city || 'Unknown'}\nSource URL: ${vendor.source_url || ''}`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are the Talentr AI Analyst. Analyze this vendor profile based on limited data.

OUTPUT JSON:
{
    "profession": "string (refined category)",
    "price_tier": "Low/Mid/High/Premium (guess based on desc/context)",
    "professionalism_score": number (0-10),
    "creativity_score": number (0-10),
    "activity_level": number (0-10, default 5 if unknown),
    "confidence": number (0-100),
    "gender": "male/female/unknown",
    "age_range": "string"
}`
                },
                { role: 'user', content: context }
            ],
            temperature: 0.1,
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (e) {
        log(`AI Error: ${e.message}`);
        return null;
    }
}

async function main() {
    log('🚀 Starting AI Backfill for existing vendors...');

    // 1. Fetch pending vendors without score
    const { data: vendors, error } = await supabase
        .from('pending_vendors')
        .select('*')
        .eq('status', 'pending');
    // We want to process ALL pending, even if they have partial data, to standardize scores.
    // But maybe filter where source_data->talentr_score is null?
    // Let's just re-process everything to be sure. It's only ~150 records.

    if (error) {
        console.error('DB Error:', error);
        return;
    }

    log(`Found ${vendors.length} vendors to analyze.`);

    for (const vendor of vendors) {
        // Skip if already has full AI data (from new agent)
        if (vendor.source_data && vendor.source_data.talentr_score) {
            log(`⏭️  Skipping ${vendor.name} (already scored: ${vendor.source_data.talentr_score})`);
            continue;
        }

        log(`🧠 Analyzing: ${vendor.name} (${vendor.category})...`);
        const analysis = await analyzeVendor(vendor);

        if (analysis) {
            const tScore = calculateTalentrScore(
                analysis.professionalism_score,
                analysis.creativity_score,
                analysis.price_tier,
                analysis.activity_level
            );

            // Merge with existing source_data
            const updatedSourceData = {
                ...(vendor.source_data || {}),
                ai_analysis: analysis,
                talentr_score: tScore,
                backfilled_at: new Date().toISOString()
            };

            const { error: updateError } = await supabase
                .from('pending_vendors')
                .update({
                    source_data: updatedSourceData
                })
                .eq('id', vendor.id);

            if (updateError) {
                log(`   ❌ Update failed: ${updateError.message}`);
            } else {
                log(`   ✅ Scored: ${tScore}/10 | Tier: ${analysis.price_tier}`);
            }
        }

        // Rate limit slightly
        await new Promise(r => setTimeout(r, 500));
    }

    log('🏁 Backfill complete.');
}

main().catch(console.error);

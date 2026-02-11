'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Filter, ChevronDown, Star,
    MessageCircle, Copy, CheckCircle,
    DollarSign, Zap, Briefcase
} from 'lucide-react';

interface Vendor {
    id: string;
    phone: string;
    name: string | null;
    category: string | null;
    status: string;
    confirmation_token: string;
    source_data: {
        talentr_score?: number;
        ai_analysis?: {
            price_tier?: 'Low' | 'Mid' | 'High' | 'Premium';
            professionalism_score?: number;
            creativity_score?: number;
            activity_level?: number;
            gender?: string;
            age_range?: string;
            summary?: string;
            confidence?: number;
        };
    };
}

const FIRST_MESSAGE = `שלום! 👋
ראיתי שאתה פעיל בתחום האירועים.
אנחנו משיקים פלטפורמה חדשה לטאלנטים - Talentr.
AI שמחבר בין אמנים ללקוחות אוטומטית.
בלי לחפש בקבוצות - המערכת שולחת לך הזמנות מוכנות.
כרגע בבטא בחינם 🎁
מעניין אותך לשמוע עוד?`;

export default function OutreachPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'pending' | 'hold' | 'invited'>('pending');
    const [copied, setCopied] = useState<string | null>(null);
    const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

    // Filters & Sort
    const [sortBy, setSortBy] = useState<'score' | 'date' | 'tier'>('score');
    const [filterCategory, setFilterCategory] = useState<string>('All');

    useEffect(() => {
        loadVendors();
    }, [tab]);

    const loadVendors = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/outreach?status=${tab}`);
            const data = await res.json();
            setVendors(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    // --- CATEGORY NORMALIZATION ---
    const normalizeCategory = (raw: string | null) => {
        if (!raw) return 'Other';
        const lower = raw.toLowerCase().trim();

        if (lower.includes('dj') || lower.includes('music') || lower.includes('singer') || lower.includes('band')) return 'Music & DJ';
        if (lower.includes('photo') || lower.includes('video') || lower.includes('camera')) return 'Photo & Video';
        if (lower.includes('makeup') || lower.includes('hair') || lower.includes('beauty')) return 'Beauty';
        if (lower.includes('event') || lower.includes('plan') || lower.includes('produc') || lower.includes('אירועים')) return 'Event Planner';
        if (lower.includes('decor') || lower.includes('balloon') || lower.includes('flower')) return 'Decor';
        if (lower.includes('cook') || lower.includes('chef') || lower.includes('food') || lower.includes('bar')) return 'Food & Bar';
        if (lower.includes('rabbi') || lower.includes('mohel')) return 'Rabbi';
        if (lower.includes('magician') || lower.includes('mentalist')) return 'Magician';

        return raw.charAt(0).toUpperCase() + raw.slice(1);
    };

    const categories = useMemo(() => {
        const cats = new Set<string>();
        vendors.forEach(v => {
            cats.add(normalizeCategory(v.category));
        });
        return ['All', ...Array.from(cats).sort()];
    }, [vendors]);

    const processedVendors = useMemo(() => {
        let result = [...vendors];

        if (filterCategory !== 'All') {
            result = result.filter(v => normalizeCategory(v.category) === filterCategory);
        }

        result.sort((a, b) => {
            if (sortBy === 'score') {
                return (b.source_data?.talentr_score || 0) - (a.source_data?.talentr_score || 0);
            }
            if (sortBy === 'tier') {
                const tiers = { 'Premium': 4, 'High': 3, 'Mid': 2, 'Low': 1 };
                const tA = tiers[a.source_data?.ai_analysis?.price_tier || 'Low'] || 0;
                const tB = tiers[b.source_data?.ai_analysis?.price_tier || 'Low'] || 0;
                return tB - tA;
            }
            return 0;
        });

        return result;
    }, [vendors, filterCategory, sortBy]);

    const formatPhone = (phone: string) => {
        const clean = phone.replace(/\D/g, '');
        return clean.startsWith('0') ? '972' + clean.slice(1) : clean;
    };

    const getFirstMessageLink = (v: Vendor) => {
        const phone = formatPhone(v.phone);
        return `https://wa.me/${phone}?text=${encodeURIComponent(FIRST_MESSAGE)}`;
    };

    const getInviteLink = (v: Vendor) => {
        return `https://talentr.co.il/onboarding?invite=${v.confirmation_token}`;
    };

    const updateStatus = async (v: Vendor, status: string) => {
        setVendors(prev => prev.filter(x => x.id !== v.id));
        await fetch('/api/outreach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: v.id, status })
        });
    };

    const copyLink = (v: Vendor) => {
        navigator.clipboard.writeText(getInviteLink(v));
        setCopied(v.id);
        setTimeout(() => setCopied(null), 2000);
    };

    const tabColors = {
        pending: '#f59e0b',
        hold: '#3b82f6',
        invited: '#10b981'
    };

    const TierBadge = ({ tier }: { tier?: string }) => {
        if (!tier) return null;
        let color = '#9ca3af';
        let icon = <DollarSign size={10} />;
        if (tier === 'Mid') color = '#60a5fa';
        if (tier === 'High') { color = '#a855f7'; icon = <DollarSign size={10} />; }
        if (tier === 'Premium') { color = '#f472b6'; icon = <Star size={10} fill={color} />; }

        return (
            <span style={{
                display: 'flex', alignItems: 'center', gap: 2,
                fontSize: 10, padding: '2px 6px', borderRadius: 10,
                background: `${color}22`, color: color, border: `1px solid ${color}44`
            }}>
                {tier}
            </span>
        );
    };

    const ScoreBadge = ({ score }: { score?: number }) => {
        if (!score) return null;
        let color = '#fbbf24';
        if (score < 5) color = '#ef4444';
        if (score >= 7.5) color = '#10b981';
        if (score >= 9) color = '#8b5cf6';

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                    fontSize: 12, fontWeight: 800, color: color,
                    background: `${color}15`, padding: '2px 8px', borderRadius: 6,
                    border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', gap: 3
                }}>
                    <Star size={10} fill={color} strokeWidth={0} />
                    {score.toFixed(1)}
                </div>
            </div>
        );
    };

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5', fontFamily: 'Inter, sans-serif' }}>

            {/* --- HEADER --- */}
            <div style={{
                background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)',
                position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #222'
            }}>
                <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.5px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', padding: 6, borderRadius: 8 }}>
                                <Zap size={18} color="white" fill="white" />
                            </div>
                            Talentr <span style={{ opacity: 0.5, fontWeight: 400 }}>Outreach</span>
                        </h1>
                        <div style={{ fontSize: 13, color: '#888', fontWeight: 500, background: '#1a1a1a', padding: '4px 10px', borderRadius: 20 }}>
                            {processedVendors.length} found
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 4, background: '#161616', padding: 4, borderRadius: 10, width: 'fit-content', border: '1px solid #222' }}>
                        {(['pending', 'hold', 'invited'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    padding: '6px 16px', borderRadius: 8, border: 'none',
                                    background: tab === t ? tabColors[t] : 'transparent',
                                    color: tab === t ? 'white' : '#666',
                                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: tab === t ? '0 2px 10px rgba(0,0,0,0.2)' : 'none'
                                }}
                            >
                                {t === 'pending' ? 'New' : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- FILTERS --- */}
                <div style={{
                    padding: '0 20px 16px', display: 'flex', gap: 10, overflowX: 'auto',
                    scrollbarWidth: 'none', alignItems: 'center'
                }}>
                    <div style={{ position: 'relative' }}>
                        <Filter size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#666', pointerEvents: 'none' }} />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            style={{
                                appearance: 'none',
                                background: '#1a1a1a', color: 'white', border: '1px solid #333',
                                padding: '8px 32px 8px 32px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
                                fontWeight: 500, minWidth: 120
                            }}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: 11, color: '#666', pointerEvents: 'none' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                appearance: 'none',
                                background: '#1a1a1a', color: 'white', border: '1px solid #333',
                                padding: '8px 32px 8px 12px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            <option value="score">⭐ Highest Score</option>
                            <option value="tier">💰 Highest Price</option>
                            <option value="date">📅 Newest</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: 11, color: '#666', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            {/* --- LIST --- */}
            <div style={{ padding: '16px 12px', maxWidth: 640, margin: '0 auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
                        <div className="loader" style={{ margin: '0 auto 20px' }}></div>
                        <p>Scanning intelligence...</p>
                    </div>
                ) : processedVendors.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#444', marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ background: '#1a1a1a', padding: 20, borderRadius: '50%', marginBottom: 16 }}>
                            <Briefcase size={32} />
                        </div>
                        <p style={{ margin: 0, fontWeight: 500 }}>No vendors match constraints.</p>
                        <p style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Try changing filters.</p>
                    </div>
                ) : (
                    processedVendors.map((v, i) => {
                        const ai = v.source_data?.ai_analysis;
                        const score = v.source_data?.talentr_score;
                        const isExpanded = expandedVendor === v.id;
                        const isElite = (score || 0) >= 8.5;
                        const cleanCategory = normalizeCategory(v.category);
                        const isNameGeneric = !v.name || v.name.includes('Talent') || v.name.includes('מומחה');

                        return (
                            <div key={v.id} style={{
                                background: '#161616',
                                borderRadius: 16,
                                marginBottom: 12,
                                border: isElite ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #222',
                                overflow: 'hidden',
                                boxShadow: isElite ? '0 4px 24px rgba(16, 185, 129, 0.08)' : 'none',
                                position: 'relative',
                                transition: 'transform 0.2s',
                            }}>
                                <div
                                    onClick={() => setExpandedVendor(isExpanded ? null : v.id)}
                                    style={{ padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                                >
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 14,
                                        background: isElite
                                            ? `linear-gradient(135deg, #059669, #047857)`
                                            : `linear-gradient(135deg, #262626, #171717)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 18, fontWeight: 'bold', color: isElite ? 'white' : '#666',
                                        border: isElite ? 'none' : '1px solid #333',
                                        flexShrink: 0
                                    }}>
                                        {v.name ? v.name.slice(0, 1).toUpperCase() : '?'}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                            <div style={{
                                                fontWeight: 600, fontSize: 15, color: isNameGeneric ? '#888' : 'white',
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%',
                                                fontStyle: isNameGeneric ? 'italic' : 'normal'
                                            }}>
                                                {v.name || 'Unknown Talent'}
                                            </div>
                                            <ScoreBadge score={score} />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{
                                                fontSize: 12, color: '#aaa',
                                                background: '#222', padding: '2px 8px', borderRadius: 6
                                            }}>
                                                {cleanCategory}
                                            </span>
                                            <TierBadge tier={ai?.price_tier} />
                                        </div>
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        color="#444"
                                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                    />
                                </div>

                                {isExpanded && (
                                    <div style={{
                                        padding: '0 16px 16px',
                                        borderTop: '1px solid #222',
                                        background: '#131313',
                                        animation: 'fadeIn 0.2s ease-in-out'
                                    }}>
                                        {ai && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 12 }}>
                                                <div style={metricStyle}>🎨 Creative <span style={{ color: 'white' }}>{ai.creativity_score}</span></div>
                                                <div style={metricStyle}>👔 Professional <span style={{ color: 'white' }}>{ai.professionalism_score}</span></div>
                                                <div style={metricStyle}>⚡ Active <span style={{ color: 'white' }}>{ai.activity_level}</span></div>
                                                <div style={metricStyle}>🤖 Confidence <span style={{ color: 'white' }}>{ai.confidence}%</span></div>
                                            </div>
                                        )}
                                        {ai?.summary && (
                                            <div style={{ marginTop: 12, padding: 10, background: '#1a1a1a', borderRadius: 8, fontSize: 12, color: '#999', fontStyle: 'italic', lineHeight: '1.5' }}>
                                                "{ai.summary}"
                                            </div>
                                        )}

                                        <div style={{ marginTop: 12, fontSize: 11, color: '#444', display: 'flex', gap: 10 }}>
                                            <span>ID: {v.id.slice(0, 8)}</span>
                                            <span>Added: {new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    padding: 12, background: '#111', borderTop: '1px solid #222',
                                    display: 'flex', gap: 10
                                }}>
                                    {tab === 'pending' && (
                                        <a
                                            href={getFirstMessageLink(v)}
                                            target="_blank"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateStatus(v, 'hold');
                                            }}
                                            style={{ ...actionButtonStyle('#10b981'), height: 40 }}
                                        >
                                            <MessageCircle size={18} fill="white" strokeWidth={0} />
                                            <span style={{ fontWeight: 600 }}>WhatsApp</span>
                                        </a>
                                    )}

                                    {tab === 'hold' && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); copyLink(v); }}
                                                style={{ ...actionButtonStyle(copied === v.id ? '#10b981' : '#222'), flex: 1, border: '1px solid #333' }}
                                            >
                                                {copied === v.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                                {copied === v.id ? 'Copied' : 'Link'}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateStatus(v, 'invited'); }}
                                                style={{ ...actionButtonStyle('#2563eb'), flex: 2 }}
                                            >
                                                Mark Sent
                                            </button>
                                        </>
                                    )}

                                    {tab === 'invited' && (
                                        <div style={{ width: '100%', textAlign: 'center', fontSize: 12, color: '#444', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                            <CheckCircle size={14} color="#10b981" /> Invite sent
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

const metricStyle = {
    background: '#1a1a1a', padding: '8px', borderRadius: 6,
    fontSize: 11, color: '#666', display: 'flex', justifyContent: 'space-between'
};

const actionButtonStyle = (bg: string, outline = false) => ({
    flex: 1,
    background: outline ? 'transparent' : bg,
    border: outline ? `1px solid #333` : 'none',
    color: outline ? '#888' : 'white',
    padding: '0 16px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    textDecoration: 'none',
    transition: 'all 0.2s'
});

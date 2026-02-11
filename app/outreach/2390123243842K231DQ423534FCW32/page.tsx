'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Search, Filter, ChevronDown, ChevronUp, Star,
    MessageCircle, Copy, CheckCircle, ExternalLink,
    MoreHorizontal, DollarSign, Zap, Briefcase
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

    const categories = useMemo(() => {
        const cats = new Set(vendors.map(v => v.category).filter(Boolean));
        return ['All', ...Array.from(cats)];
    }, [vendors]);

    const processedVendors = useMemo(() => {
        let result = [...vendors];

        // Filter
        if (filterCategory !== 'All') {
            result = result.filter(v => v.category === filterCategory);
        }

        // Sort
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
            // Date (ID fallback essentially as newer IDs are larger/uuids not sequentially sortable usually but created_at sorting is better done on backend or if we had the field)
            // Assuming default backend sort is date, so we reverse for newest if needed, or just keep as is.
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
        setVendors(prev => prev.filter(x => x.id !== v.id)); // Optimistic UI
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
        pending: '#f59e0b', // Amber/Orange
        hold: '#3b82f6', // Blue
        invited: '#10b981' // Emerald
    };

    // Helper for Tier Badge
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

    // Helper for Score Badge
    const ScoreBadge = ({ score }: { score?: number }) => {
        if (!score) return null;
        let color = '#fbbf24';
        if (score < 5) color = '#ef4444';
        if (score >= 7.5) color = '#10b981';
        if (score >= 9) color = '#8b5cf6'; // Pro level usually

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
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5', fontFamily: 'sans-serif' }}>

            {/* --- HEADER & TABS --- */}
            <div style={{
                background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)',
                position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #222'
            }}>
                <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={18} color="#f59e0b" fill="#f59e0b" />
                            Talentr Outreach
                        </h1>
                        <div style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>
                            {processedVendors.length} found
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 4, background: '#1a1a1a', padding: 4, borderRadius: 12, width: 'fit-content' }}>
                        {(['pending', 'hold', 'invited'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    padding: '6px 16px', borderRadius: 8, border: 'none',
                                    background: tab === t ? tabColors[t] : 'transparent',
                                    color: tab === t ? 'white' : '#666',
                                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- FILTERS BAR --- */}
                <div style={{
                    padding: '0 20px 12px', display: 'flex', gap: 10, overflowX: 'auto',
                    scrollbarWidth: 'none'
                }}>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{
                            background: '#222', color: 'white', border: '1px solid #333',
                            padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer'
                        }}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{
                            background: '#222', color: 'white', border: '1px solid #333',
                            padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer'
                        }}
                    >
                        <option value="score">⭐ Sort: Highest Score</option>
                        <option value="tier">💰 Sort: Highest Price</option>
                        <option value="date">📅 Sort: Newest</option>
                    </select>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div style={{ padding: 12, maxWidth: 600, margin: '0 auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                        <div className="loader"></div>
                        Running AI analysis...
                    </div>
                ) : processedVendors.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#444', marginTop: 60 }}>
                        <Briefcase size={40} style={{ marginBottom: 10, opacity: 0.2 }} />
                        <p>No vendors found here.</p>
                    </div>
                ) : (
                    processedVendors.map((v, i) => {
                        const ai = v.source_data?.ai_analysis;
                        const score = v.source_data?.talentr_score;
                        const isExpanded = expandedVendor === v.id;
                        const isElite = (score || 0) >= 8.5;

                        return (
                            <div key={v.id} style={{
                                background: '#161616',
                                borderRadius: 16,
                                marginBottom: 12,
                                border: isElite ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #222',
                                overflow: 'hidden',
                                boxShadow: isElite ? '0 4px 20px rgba(16, 185, 129, 0.1)' : 'none',
                                position: 'relative'
                            }}>
                                {/* Top Row */}
                                <div
                                    onClick={() => setExpandedVendor(isExpanded ? null : v.id)}
                                    style={{ padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                                >
                                    {/* Avatar Initials */}
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 12,
                                        background: `linear-gradient(135deg, #333, #222)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 16, fontWeight: 'bold', color: '#888',
                                        border: '1px solid #333'
                                    }}>
                                        {v.name ? v.name.slice(0, 1).toUpperCase() : '?'}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ fontWeight: 600, fontSize: 15, color: 'white' }}>
                                                {v.name || 'Unknown Talent'}
                                            </div>
                                            <ScoreBadge score={score} />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                            <span style={{ fontSize: 12, color: '#888' }}>{v.category || 'Event Pro'}</span>
                                            <TierBadge tier={ai?.price_tier} />
                                        </div>
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        color="#444"
                                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                    />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '0 16px 16px',
                                        borderTop: '1px solid #222',
                                        background: '#131313'
                                    }}>
                                        {ai && (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                                                <div style={metricStyle}>🎨 Creativity: <span style={{ color: 'white' }}>{ai.creativity_score}</span></div>
                                                <div style={metricStyle}>👔 Professionalism: <span style={{ color: 'white' }}>{ai.professionalism_score}</span></div>
                                                <div style={metricStyle}>⚡ Activity: <span style={{ color: 'white' }}>{ai.activity_level}</span></div>
                                                <div style={metricStyle}>🤖 Confidence: <span style={{ color: 'white' }}>{ai.confidence}%</span></div>
                                            </div>
                                        )}
                                        {ai?.summary && (
                                            <div style={{ marginTop: 12, fontSize: 12, color: '#888', fontStyle: 'italic', lineHeight: '1.4' }}>
                                                "{ai.summary}"
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Card Actions Footer */}
                                <div style={{
                                    padding: 12, background: '#111', borderTop: '1px solid #222',
                                    display: 'flex', gap: 8
                                }}>
                                    {tab === 'pending' && (
                                        <a
                                            href={getFirstMessageLink(v)}
                                            target="_blank"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateStatus(v, 'hold');
                                            }}
                                            style={actionButtonStyle('#10b981')}
                                        >
                                            <MessageCircle size={16} /> WhatsApp
                                        </a>
                                    )}

                                    {tab === 'hold' && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); copyLink(v); }}
                                                style={{ ...actionButtonStyle(copied === v.id ? '#10b981' : '#3b82f6'), flex: 1 }}
                                            >
                                                {copied === v.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                                {copied === v.id ? 'Copied' : 'Copy Invite'}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateStatus(v, 'invited'); }}
                                                style={{ ...actionButtonStyle('#222', true), width: 'auto' }}
                                            >
                                                Mark Sent
                                            </button>
                                        </>
                                    )}

                                    {tab === 'invited' && (
                                        <div style={{ width: '100%', textAlign: 'center', fontSize: 12, color: '#444', padding: 8 }}>
                                            Invitation Sent on {new Date().toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* FAB for refresh maybe? */}
            <button
                onClick={loadVendors}
                style={{
                    position: 'fixed', bottom: 20, right: 20,
                    width: 48, height: 48, borderRadius: 24,
                    background: 'white', color: 'black',
                    border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 100
                }}
            >
                <MoreHorizontal size={24} />
            </button>
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
    padding: '10px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    textDecoration: 'none'
});

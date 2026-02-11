'use client';

import { useState, useEffect } from 'react';

interface Vendor {
    id: string;
    phone: string;
    name: string | null;
    category: string | null;
    status: string;
    confirmation_token: string;
    source_data: any;
}

// Сообщение БЕЗ ссылки - первый контакт
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

    const formatPhone = (phone: string) => {
        const clean = phone.replace(/\D/g, '');
        return clean.startsWith('0') ? '972' + clean.slice(1) : clean;
    };

    // Первичное сообщение БЕЗ ссылки
    const getFirstMessageLink = (v: Vendor) => {
        const phone = formatPhone(v.phone);
        return `https://wa.me/${phone}?text=${encodeURIComponent(FIRST_MESSAGE)}`;
    };

    // Полная ссылка для копирования
    const getInviteLink = (v: Vendor) => {
        return `https://talentr.co.il/onboarding?invite=${v.confirmation_token}`;
    };

    // Pending → Hold (после первого контакта)
    const moveToHold = async (v: Vendor) => {
        setVendors(prev => prev.filter(x => x.id !== v.id));
        await fetch('/api/outreach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: v.id, status: 'hold' })
        });
    };

    // Hold → Invited (после отправки ссылки)
    const moveToInvited = async (v: Vendor) => {
        setVendors(prev => prev.filter(x => x.id !== v.id));
        await fetch('/api/outreach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: v.id, status: 'invited' })
        });
    };

    // Копировать ссылку
    const copyLink = (v: Vendor) => {
        navigator.clipboard.writeText(getInviteLink(v));
        setCopied(v.id);
        setTimeout(() => setCopied(null), 2000);
    };

    const tabColors = {
        pending: '#f59e0b',
        hold: '#3b82f6',
        invited: '#22c55e'
    };

    return (
        <div style={{ background: '#111', minHeight: '100vh', color: 'white' }}>
            {/* Header */}
            <div style={{
                background: tabColors[tab],
                padding: '16px',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <h1 style={{ margin: 0, fontSize: 18, textAlign: 'center' }}>
                    📱 {vendors.length} vendors
                </h1>
                <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'center' }}>
                    {(['pending', 'hold', 'invited'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: 20,
                                border: 'none',
                                background: tab === t ? 'white' : 'rgba(255,255,255,0.3)',
                                color: tab === t ? tabColors[t] : 'white',
                                fontWeight: 'bold',
                                fontSize: 13
                            }}
                        >
                            {t === 'pending' ? '⏳ New' : t === 'hold' ? '💬 Hold' : '✅ Sent'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div style={{
                padding: '10px 12px',
                background: '#222',
                fontSize: 12,
                color: '#888',
                textAlign: 'center'
            }}>
                Sort: <span style={{ color: '#fbbf24' }}>⭐ Talentr Score (High to Low)</span>
            </div>

            {/* List */}
            <div style={{ padding: 12 }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                ) : vendors.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>Empty 🎉</p>
                ) : (
                    vendors
                        .sort((a: any, b: any) => {
                            const scoreA = a.source_data?.talentr_score || 0;
                            const scoreB = b.source_data?.talentr_score || 0;
                            return scoreB - scoreA;
                        })
                        .map((v: any, i) => {
                            const score = v.source_data?.talentr_score;
                            const ai = v.source_data?.ai_analysis;
                            const tier = ai?.price_tier;

                            let tierIcon = '💲';
                            if (tier === 'Mid') tierIcon = '💲💲';
                            if (tier === 'High') tierIcon = '💎';
                            if (tier === 'Premium') tierIcon = '👑';

                            let scoreColor = '#fbbf24';
                            if (score && score < 5) scoreColor = '#ef4444';
                            if (score && score > 8) scoreColor = '#10b981';

                            const isExpanded = expandedVendor === v.id;

                            return (
                                <div key={v.id} style={{
                                    background: '#1a1a1a',
                                    borderRadius: 12,
                                    padding: 14,
                                    marginBottom: 10,
                                    border: `1px solid ${tabColors[tab]}33`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                        <div style={{
                                            background: tabColors[tab],
                                            color: 'white',
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            flexShrink: 0
                                        }}>
                                            {i + 1}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                {v.name || 'Unknown'}
                                                {score && (
                                                    <span style={{
                                                        fontSize: 11,
                                                        padding: '2px 6px',
                                                        borderRadius: 4,
                                                        background: `${scoreColor}22`,
                                                        color: scoreColor,
                                                        fontWeight: '900'
                                                    }}>
                                                        ⭐ {score}
                                                    </span>
                                                )}
                                                {tier && (
                                                    <span style={{ fontSize: 11, color: '#aaa' }}>{tierIcon}</span>
                                                )}
                                                <button
                                                    onClick={() => setExpandedVendor(isExpanded ? null : v.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#666',
                                                        cursor: 'pointer',
                                                        fontSize: 16,
                                                        padding: 2,
                                                        marginLeft: 4
                                                    }}
                                                >
                                                    {isExpanded ? '🔼' : '🔍'}
                                                </button>
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                +{formatPhone(v.phone)} • {v.category || ''}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Insights Expanded View */}
                                    {isExpanded && ai && (
                                        <div style={{
                                            marginTop: -4,
                                            marginBottom: 14,
                                            padding: 12,
                                            background: '#222',
                                            borderRadius: 8,
                                            fontSize: 12,
                                            border: '1px solid #333'
                                        }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                                                <div>🎨 Creativity: <b style={{ color: 'white' }}>{ai.creativity_score}/10</b></div>
                                                <div>👔 Pro: <b style={{ color: 'white' }}>{ai.professionalism_score}/10</b></div>
                                                <div>⚡ Activity: <b style={{ color: 'white' }}>{ai.activity_level}/10</b></div>
                                                <div>💰 Tier: <b style={{ color: 'white' }}>{tier}</b></div>
                                            </div>

                                            {ai.gender && (
                                                <div style={{ marginBottom: 4, color: '#aaa' }}>
                                                    👤 {ai.gender} {ai.age_range ? `• ${ai.age_range}` : ''}
                                                </div>
                                            )}

                                            {ai.summary && (
                                                <div style={{ fontStyle: 'italic', color: '#888', marginTop: 6, borderTop: '1px solid #333', paddingTop: 6 }}>
                                                    "{ai.summary}"
                                                </div>
                                            )}

                                            {ai.confidence && (
                                                <div style={{ marginTop: 4, fontSize: 10, color: '#444' }}>
                                                    🤖 AI Confidence: {ai.confidence}%
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions based on tab */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {tab === 'pending' && (
                                            <a
                                                href={getFirstMessageLink(v)}
                                                target="_blank"
                                                onClick={() => moveToHold(v)}
                                                style={{
                                                    flex: 1,
                                                    background: '#25D366',
                                                    color: 'white',
                                                    padding: '12px',
                                                    borderRadius: 10,
                                                    textDecoration: 'none',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                📱 WhatsApp
                                            </a>
                                        )}

                                        {tab === 'hold' && (
                                            <>
                                                <button
                                                    onClick={() => copyLink(v)}
                                                    style={{
                                                        flex: 1,
                                                        background: copied === v.id ? '#22c55e' : '#3b82f6',
                                                        color: 'white',
                                                        padding: '12px',
                                                        borderRadius: 10,
                                                        border: 'none',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {copied === v.id ? '✅ Copied!' : '📋 Copy Link'}
                                                </button>
                                                <button
                                                    onClick={() => moveToInvited(v)}
                                                    style={{
                                                        background: '#22c55e',
                                                        color: 'white',
                                                        padding: '12px 16px',
                                                        borderRadius: 10,
                                                        border: 'none',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✅ Sent
                                                </button>
                                            </>
                                        )}

                                        {tab === 'invited' && (
                                            <div style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: '#1f2937',
                                                borderRadius: 10,
                                                textAlign: 'center',
                                                color: '#666'
                                            }}>
                                                Link sent ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                )}
            </div>
        </div>
    );
}

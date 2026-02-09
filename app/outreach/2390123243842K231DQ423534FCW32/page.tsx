'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PendingVendor {
    id: string;
    phone: string;
    name: string | null;
    category: string | null;
    status: string;
    confirmation_token: string;
}

const MESSAGE = `שלום! 👋
ראיתי שאתה פעיל בתחום האירועים.
Talentr - פלטפורמה חדשה לטאלנטים.
AI שמחבר אמנים ללקוחות אוטומטית.
בטא בחינם 🎁
הרשמה:`;

export default function OutreachPage() {
    const [vendors, setVendors] = useState<PendingVendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'pending' | 'invited'>('pending');

    useEffect(() => {
        loadVendors();
    }, [tab]);

    const loadVendors = async () => {
        if (!supabase) return;
        setLoading(true);

        const { data } = await supabase
            .from('pending_vendors')
            .select('id, phone, name, category, status, confirmation_token')
            .eq('status', tab)
            .order('created_at', { ascending: false });

        setVendors(data || []);
        setLoading(false);
    };

    const formatPhone = (phone: string) => {
        const clean = phone.replace(/\D/g, '');
        return clean.startsWith('0') ? '972' + clean.slice(1) : clean;
    };

    const getWaLink = (v: PendingVendor) => {
        const phone = formatPhone(v.phone);
        const link = `https://talentr.co.il/onboarding?invite=${v.confirmation_token}`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(MESSAGE + ' ' + link)}`;
    };

    const handleClick = async (v: PendingVendor) => {
        // Сразу удаляем из UI
        setVendors(prev => prev.filter(x => x.id !== v.id));

        // Обновляем в БД
        if (supabase) {
            await supabase
                .from('pending_vendors')
                .update({ status: 'invited' })
                .eq('id', v.id);
        }
    };

    return (
        <div style={{ background: '#111', minHeight: '100vh', color: 'white' }}>
            {/* Header */}
            <div style={{
                background: '#25D366',
                padding: '16px',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <h1 style={{ margin: 0, fontSize: 18, textAlign: 'center' }}>
                    📱 {vendors.length} vendors
                </h1>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                    <button
                        onClick={() => setTab('pending')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 20,
                            border: 'none',
                            background: tab === 'pending' ? 'white' : 'rgba(255,255,255,0.3)',
                            color: tab === 'pending' ? '#25D366' : 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        ⏳ Pending
                    </button>
                    <button
                        onClick={() => setTab('invited')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 20,
                            border: 'none',
                            background: tab === 'invited' ? 'white' : 'rgba(255,255,255,0.3)',
                            color: tab === 'invited' ? '#25D366' : 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        ✅ Invited
                    </button>
                </div>
            </div>

            {/* List */}
            <div style={{ padding: 12 }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                ) : vendors.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>Empty 🎉</p>
                ) : (
                    vendors.map((v, i) => (
                        <div key={v.id} style={{
                            background: '#222',
                            borderRadius: 12,
                            padding: 14,
                            marginBottom: 10,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <div style={{
                                background: '#25D366',
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

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                                    {v.name || 'Unknown'}
                                </div>
                                <div style={{ fontSize: 12, color: '#888' }}>
                                    +{formatPhone(v.phone)}
                                </div>
                            </div>

                            <a
                                href={getWaLink(v)}
                                target="_blank"
                                onClick={() => handleClick(v)}
                                style={{
                                    background: '#25D366',
                                    color: 'white',
                                    padding: '10px 16px',
                                    borderRadius: 20,
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    flexShrink: 0
                                }}
                            >
                                📱 Send
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

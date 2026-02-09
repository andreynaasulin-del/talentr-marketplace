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
    created_at: string;
}

// Секретные креды
const SECRET_EMAIL = 'admintalentrvendorscounting@derzko.com';
const SECRET_PASSWORD = '2390123243842K231DQ423534FCW32';

// Текст сообщения
const MESSAGE_TEMPLATE = `שלום! 👋
ראיתי שאתה פעיל בתחום האירועים.
Talentr - פלטפורמה חדשה לטאלנטים.
AI שמחבר אמנים ללקוחות אוטומטית.
בטא בחינם 🎁
הרשמה:`;

export default function OutreachPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [vendors, setVendors] = useState<PendingVendor[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'pending' | 'invited' | 'all'>('pending');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === SECRET_EMAIL && password === SECRET_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('outreach_auth', 'true');
            setError('');
        } else {
            setError('Invalid credentials');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('outreach_auth') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadVendors();
        }
    }, [isAuthenticated, filter]);

    const loadVendors = async () => {
        setLoading(true);
        if (!supabase) return;

        let query = supabase
            .from('pending_vendors')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error loading vendors:', error);
        } else {
            setVendors(data || []);
        }
        setLoading(false);
    };

    const formatPhone = (phone: string) => {
        const clean = phone.replace(/\D/g, '');
        return clean.startsWith('0') ? '972' + clean.slice(1) : clean;
    };

    const getWhatsAppLink = (vendor: PendingVendor) => {
        const phone = formatPhone(vendor.phone);
        const inviteLink = `https://talentr.co.il/onboarding?invite=${vendor.confirmation_token}`;
        const fullMessage = `${MESSAGE_TEMPLATE} ${inviteLink}`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
    };

    const markAsInvited = async (id: string) => {
        if (!supabase) return;
        await supabase
            .from('pending_vendors')
            .update({ status: 'invited' })
            .eq('id', id);

        // Удаляем из списка
        setVendors(vendors.filter(v => v.id !== id));
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 20
            }}>
                <form onSubmit={handleLogin} style={{
                    background: 'white',
                    padding: 30,
                    borderRadius: 16,
                    width: '100%',
                    maxWidth: 400,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 20 }}>🔐 Access</h2>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            width: '100%',
                            padding: 15,
                            marginBottom: 15,
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            fontSize: 16
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: 15,
                            marginBottom: 20,
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            fontSize: 16
                        }}
                    />
                    <button type="submit" style={{
                        width: '100%',
                        padding: 15,
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            paddingBottom: 100
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px 15px',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h1 style={{ margin: 0, fontSize: 20, textAlign: 'center' }}>
                    📱 Outreach ({vendors.length})
                </h1>

                {/* Filter tabs */}
                <div style={{
                    display: 'flex',
                    gap: 10,
                    marginTop: 15,
                    justifyContent: 'center'
                }}>
                    {(['pending', 'invited', 'all'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 20,
                                border: 'none',
                                background: filter === f ? 'white' : 'rgba(255,255,255,0.2)',
                                color: filter === f ? '#667eea' : 'white',
                                fontWeight: filter === f ? 'bold' : 'normal',
                                cursor: 'pointer',
                                fontSize: 14
                            }}
                        >
                            {f === 'pending' ? '⏳ Pending' : f === 'invited' ? '✅ Invited' : '📋 All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div style={{ padding: 15 }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                ) : vendors.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>No vendors found</p>
                ) : (
                    vendors.map((vendor, i) => (
                        <div key={vendor.id} style={{
                            background: 'white',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{
                                    background: '#667eea',
                                    color: 'white',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 12,
                                    flexShrink: 0
                                }}>
                                    {i + 1}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                        {vendor.name || 'Unknown'}
                                    </div>
                                    {vendor.category && (
                                        <span style={{
                                            background: '#f0f0f0',
                                            padding: '2px 8px',
                                            borderRadius: 10,
                                            fontSize: 11,
                                            color: '#666'
                                        }}>
                                            {vendor.category}
                                        </span>
                                    )}
                                    <div style={{ color: '#666', fontSize: 14, marginTop: 6 }}>
                                        +{formatPhone(vendor.phone)}
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: 10,
                                    color: vendor.status === 'pending' ? '#f90' : '#0a0',
                                    textTransform: 'uppercase'
                                }}>
                                    {vendor.status}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div style={{
                                display: 'flex',
                                gap: 10,
                                marginTop: 12
                            }}>
                                <a
                                    href={getWhatsAppLink(vendor)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        if (vendor.status === 'pending') {
                                            markAsInvited(vendor.id);
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        background: '#25D366',
                                        color: 'white',
                                        padding: '12px 20px',
                                        borderRadius: 25,
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: 15
                                    }}
                                >
                                    <span>📱</span> WhatsApp
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Logout */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 15,
                background: 'white',
                borderTop: '1px solid #eee'
            }}>
                <button
                    onClick={() => {
                        localStorage.removeItem('outreach_auth');
                        setIsAuthenticated(false);
                    }}
                    style={{
                        width: '100%',
                        padding: 12,
                        background: '#f5f5f5',
                        border: 'none',
                        borderRadius: 8,
                        color: '#666',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

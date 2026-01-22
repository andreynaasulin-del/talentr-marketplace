'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Mail, Eye, Lock, Database, Globe } from 'lucide-react';

export default function PrivacyPage() {
    const { language } = useLanguage();

    const lastUpdated = '27 December 2024';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                        {language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400">
                        Last updated: {lastUpdated}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 md:p-12 space-y-8">

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl text-center border border-transparent dark:border-blue-900/20">
                            <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-200">Transparent</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">We tell you what we collect</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl text-center border border-transparent dark:border-green-900/20">
                            <Lock className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <p className="text-sm font-bold text-green-900 dark:text-green-200">Secure</p>
                            <p className="text-xs text-green-600 dark:text-green-400">Your data is protected</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl text-center border border-transparent dark:border-purple-900/20">
                            <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                            <p className="text-sm font-bold text-purple-900 dark:text-purple-200">Minimal</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400">We only collect what we need</p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We collect information you provide directly to us:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, phone number</li>
                            <li><strong>Profile Information:</strong> Photos, bio, service descriptions, pricing</li>
                            <li><strong>Booking Information:</strong> Event dates, types, messages between users</li>
                            <li><strong>Usage Data:</strong> How you interact with our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                            <li>To provide and maintain our services</li>
                            <li>To process bookings and facilitate communication</li>
                            <li>To send you important updates and notifications</li>
                            <li>To improve our platform and user experience</li>
                            <li>To prevent fraud and ensure security</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Information Sharing</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We do not sell your personal information. We may share your information:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                            <li>With vendors/clients as necessary to complete bookings</li>
                            <li>With service providers who assist our operations</li>
                            <li>When required by law or to protect rights</li>
                            <li>With your consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Security</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mt-4">
                            <li>Encryption in transit (HTTPS/TLS)</li>
                            <li>Secure database with row-level security</li>
                            <li>Regular security audits</li>
                            <li>Access controls and authentication</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Your Rights</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Portability:</strong> Receive your data in a portable format</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Cookies & Tracking</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We use essential cookies to maintain your session and preferences.
                            We may use analytics tools (Vercel Analytics) to understand how users interact with our platform.
                            These tools collect anonymous usage data to help us improve our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Data Retention</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We retain your personal data for as long as your account is active or as needed to provide services.
                            You can request deletion of your account at any time.
                            Some data may be retained for legal or business purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. International Users</h2>
                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl mb-4 border border-transparent dark:border-blue-900/20">
                            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <p className="text-blue-800 dark:text-blue-200 text-sm">
                                Our services are primarily offered in Israel. By using our platform,
                                you consent to the transfer and processing of your data in Israel.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Changes to This Policy</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We may update this Privacy Policy from time to time.
                            We will notify you of any significant changes via email or platform notification.
                            Your continued use of the platform after changes constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            For privacy-related questions or to exercise your rights:
                        </p>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <a href="mailto:privacy@talentr.app" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                privacy@talentr.app
                            </a>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}

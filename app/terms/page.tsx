'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Mail } from 'lucide-react';

export default function TermsPage() {
    const { language } = useLanguage();

    const lastUpdated = '27 December 2024';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                        {language === 'he' ? 'תנאי שימוש' : 'Terms of Service'}
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400">
                        Last updated: {lastUpdated}
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 md:p-12 space-y-8">

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            By accessing and using Talentr ("the Platform"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Talentr is an online marketplace that connects event professionals (vendors) with clients
                            seeking their services. We facilitate the discovery, communication, and booking process
                            but are not a party to any agreements made between vendors and clients.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                            <li>You must be at least 18 years old to create an account</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You must provide accurate and truthful information</li>
                            <li>One person or business may only maintain one account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Vendor Responsibilities</h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Provide accurate service descriptions and pricing</li>
                            <li>Respond to booking requests in a timely manner</li>
                            <li>Honor confirmed bookings</li>
                            <li>Maintain appropriate licenses and insurance for your services</li>
                            <li>Comply with all applicable laws and regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Client Responsibilities</h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Provide accurate event details when making booking requests</li>
                            <li>Communicate clearly with vendors about expectations</li>
                            <li>Honor payment terms agreed upon with vendors</li>
                            <li>Treat vendors with respect and professionalism</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Payments & Fees</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Payments for services are made directly between clients and vendors.
                            Talentr may charge service fees which will be clearly disclosed before any transaction.
                            All prices displayed on the platform are in Israeli New Shekels (₪) unless otherwise specified.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Cancellation Policy</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Cancellation policies are set by individual vendors and should be reviewed before booking.
                            Talentr is not responsible for any disputes arising from cancellations.
                            We encourage both parties to communicate directly to resolve any issues.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Talentr is not liable for any disputes, damages, or issues arising from transactions
                            between vendors and clients. We provide the platform "as is" and make no warranties
                            about the quality, reliability, or availability of services offered by vendors.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            All content on the platform, including logos, designs, and text, is the property of Talentr
                            or its licensors. Vendors retain ownership of their portfolio images and content they upload.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                            <a href="mailto:support@talentr.app" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                support@talentr.app
                            </a>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}

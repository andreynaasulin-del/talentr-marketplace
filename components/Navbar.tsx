'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, setLanguage } = useLanguage();
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        if (!isHome) {
            setIsScrolled(true);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    const languages = [
        { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
        { code: 'he' as const, label: 'עב', flag: '🇮🇱' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];
    const lang = language as 'en' | 'he';

    const content = {
        en: {
            findTalent: 'Find Talent',
            becomeVendor: 'Partner with us',
        },
        he: {
            findTalent: 'מצא כישרון',
            becomeVendor: 'הפוך לשותף',
        },
    };

    const t = content[lang];

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 bg-white border-b transition-shadow duration-200"
            style={{
                borderColor: '#E4E4E4',
                boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Logo size="lg" />
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#545454] hover:bg-[#F7F7F9] rounded-lg transition-colors"
                            >
                                <span>{currentLang.flag}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showLangDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowLangDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-32 py-1 bg-white rounded-lg border border-[#E4E4E4] shadow-md z-50">
                                        {languages.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => {
                                                    setLanguage(l.code);
                                                    setShowLangDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-[#F7F7F9] transition-colors ${language === l.code ? 'text-[#009DE0] font-semibold' : 'text-[#545454]'
                                                    }`}
                                            >
                                                <span>{l.flag}</span>
                                                <span className="text-sm">{l.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Secondary CTA */}
                        <Link
                            href="/join"
                            className="hidden md:block px-4 py-2 text-sm font-semibold text-[#009DE0] hover:bg-[#E5F3FB] rounded-lg transition-colors"
                        >
                            {t.becomeVendor}
                        </Link>

                        {/* Primary CTA */}
                        <Link
                            href={isHome ? "#packages" : "/#packages"}
                            className="px-5 py-2.5 bg-[#009DE0] hover:bg-[#0088C6] text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            {t.findTalent}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

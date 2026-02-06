'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { CategoryContent, PageType } from '@/lib/category-landing-data';
import { HOW_IT_WORKS } from '@/lib/category-landing-data';
import CategoryChat from './CategoryChat';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CategoryLandingTemplateProps {
  category: CategoryContent;
  pageType: PageType;
}

export default function CategoryLandingTemplate({ category, pageType }: CategoryLandingTemplateProps) {
  const { language } = useLanguage();
  const lang = language as 'en' | 'he';
  const isRtl = lang === 'he';

  const content = category[pageType][lang];
  const howItWorks = HOW_IT_WORKS[pageType][lang];

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Track page view
  useEffect(() => {
    trackEvent('page_view_category', {
      category: category.slug,
      page_type: pageType,
      category_type: category.type,
    });
  }, [category.slug, pageType, category.type]);

  const ctaText = pageType === 'book'
    ? { en: 'Book now', he: 'הזמן עכשיו' }
    : { en: 'Create your gig', he: 'צור את הגיג שלך' };

  const ctaLink = pageType === 'book' ? '/' : '/join';

  const handleCtaClick = () => {
    const eventName = pageType === 'book' ? 'click_book' : 'click_become';
    trackEvent(eventName, {
      category: category.slug,
      page_type: pageType,
      source: 'category_landing',
    });

    // Fire funnel start events
    if (pageType === 'book') {
      trackEvent('start_booking', {
        category: category.slug,
        category_type: category.type,
        source: 'category_landing',
      });
    } else {
      trackEvent('create_gig_start', {
        category: category.slug,
        category_type: category.type,
        source: 'category_landing',
      });
    }
  };

  // Cross-link
  const crossPageType = pageType === 'book' ? 'become' : 'book';
  const crossLink = `/${crossPageType}/${category.slug}`;

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* ===== 1. HERO SECTION ===== */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-4xl sm:text-5xl mb-4 block">{category.icon}</span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight mb-4 sm:mb-6">
              {content.h1}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
              {content.heroDescription}
            </p>

            <Link
              href={ctaLink}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 transition-all active:scale-95"
            >
              {ctaText[lang]}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. DESCRIPTION BLOCK ===== */}
      <section className="py-12 sm:py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 sm:gap-10"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                {lang === 'he' ? 'מה זה?' : 'What is it?'}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
                {content.descriptionBlock.whatIsIt}
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                {lang === 'he' ? 'לאילו אירועים?' : 'For which events?'}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
                {content.descriptionBlock.events}
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                {lang === 'he' ? 'פורמט וסגנון' : 'Format & Style'}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
                {content.descriptionBlock.format}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 3. HOW IT WORKS ===== */}
      <section className="py-12 sm:py-20 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white text-center mb-10 sm:mb-14">
              {lang === 'he' ? 'איך זה עובד' : 'How It Works'}
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="relative text-center p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-black shadow-lg shadow-blue-600/20">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 4. BENEFITS BLOCK ===== */}
      <section className="py-12 sm:py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white text-center mb-10 sm:mb-14">
              {lang === 'he' ? 'למה Talentr?' : 'Why Talentr?'}
            </h2>

            <div className="space-y-4 sm:space-y-5 max-w-2xl mx-auto">
              {content.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 text-base sm:text-lg">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 5. FAQ BLOCK ===== */}
      <section className="py-12 sm:py-20 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white text-center mb-10 sm:mb-14">
              {lang === 'he' ? 'שאלות נפוצות' : 'Frequently Asked Questions'}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {content.faq.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-start"
                  >
                    <span className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white pr-4">
                      {item.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    )}
                  </button>

                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 sm:px-6 pb-5 sm:pb-6"
                    >
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 6. CHATBOT CTA + FULLSCREEN CHAT ===== */}
      <CategoryChat
        category={category.slug}
        pageType={pageType}
      />

      {/* ===== 7. CROSS LINKS ===== */}
      <section className="py-12 sm:py-16 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-2xl mx-auto text-center px-4">
          <Link
            href={crossLink}
            className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 text-base sm:text-lg font-semibold transition-colors"
          >
            {content.crossLinkText}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-16 sm:py-24 bg-zinc-950 dark:bg-zinc-900/50">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6">
            {pageType === 'book'
              ? lang === 'he' ? 'מוכן להזמין?' : 'Ready to book?'
              : lang === 'he' ? 'מוכן להתחיל?' : 'Ready to get started?'
            }
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
            {pageType === 'book'
              ? lang === 'he' ? 'מצא את המבצע המושלם לאירוע שלך בכמה קליקים' : 'Find the perfect performer for your event in just a few clicks'
              : lang === 'he' ? 'צור את הפרופיל שלך והתחל לקבל הזמנות היום' : 'Create your profile and start getting bookings today'
            }
          </p>
          <Link
            href={ctaLink}
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95"
          >
            {ctaText[lang]}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

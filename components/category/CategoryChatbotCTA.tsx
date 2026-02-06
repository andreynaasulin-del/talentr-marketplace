'use client';

import { MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import type { CategorySlug, PageType } from '@/lib/category-landing-data';

interface CategoryChatbotCTAProps {
  category: CategorySlug;
  pageType: PageType;
  categoryLabel: string;
}

export default function CategoryChatbotCTA({ category, pageType, categoryLabel }: CategoryChatbotCTAProps) {
  const { language } = useLanguage();
  const lang = language as 'en' | 'he';

  const handleClick = () => {
    trackEvent('chatbot_opened', {
      category,
      page_type: pageType,
      source: 'category_landing',
    });

    // Build context message
    const contextMessage = pageType === 'book'
      ? lang === 'he'
        ? `משתמש בעמוד /book/${category} ורוצה עזרה בהזמנת ${categoryLabel}`
        : `User is on /book/${category} page and wants help with booking a ${categoryLabel}`
      : lang === 'he'
        ? `משתמש בעמוד /become/${category} ורוצה ליצור גיג ${categoryLabel}`
        : `User is on /become/${category} page and wants to create a ${categoryLabel} gig`;

    // Find the chat trigger on the page (from HeroSection) or open chat modal
    const chatTrigger = document.querySelector('[data-chat-trigger]') as HTMLButtonElement;
    if (chatTrigger) {
      chatTrigger.click();
      // Set context after a short delay to let chat open
      setTimeout(() => {
        const chatInput = document.querySelector('input[placeholder]') as HTMLInputElement;
        if (chatInput) {
          // Set value using native input value setter to trigger React's onChange
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(chatInput, contextMessage);
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }, 500);
    } else {
      // Fallback: redirect to home with chat context
      window.location.href = `/?chat=open&context=${encodeURIComponent(contextMessage)}`;
    }
  };

  const text = {
    en: 'Chat with Talentr Assistant',
    he: 'שוחח עם עוזר Talentr',
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto text-center px-4">
        <button
          onClick={handleClick}
          className="group inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 transition-all active:scale-95"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          <span className="text-base sm:text-lg font-bold">
            💬 {text[lang]}
          </span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </section>
  );
}

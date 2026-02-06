'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, Send, Loader2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getIntentBySlug, FALLBACK_INTENT, type ChatIntent } from '@/lib/chat-intents';
import type { CategorySlug, PageType } from '@/lib/category-landing-data';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface CategoryChatProps {
  category: CategorySlug;
  pageType: PageType;
}

export default function CategoryChat({ category, pageType }: CategoryChatProps) {
  const { language } = useLanguage();
  const lang = language as 'en' | 'he';
  const isRtl = lang === 'he';

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversionStep, setConversionStep] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Resolve intent from category slug
  const intent: ChatIntent = getIntentBySlug(category);
  const sourcePage = `/${pageType}/${category}`;

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Set welcome message when chat opens (intent-based first message)
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      const welcomeMessage = intent.firstMessage[lang] || intent.firstMessage.en;
      setChatMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
      }]);
    }
  }, [isChatOpen, lang, intent.firstMessage]);

  const handleOpen = () => {
    setIsChatOpen(true);

    // Analytics: chatbot opened with full context
    trackEvent('chatbot_opened', {
      category,
      page_type: pageType,
      url: sourcePage,
      language: lang,
      intent: intent.intent,
      source: 'category_landing',
    });

    // Store context in session for persistence
    try {
      sessionStorage.setItem('talentr_chat_context', JSON.stringify({
        page_type: pageType,
        category,
        url: sourcePage,
        language: lang,
        intent: intent.intent,
      }));
    } catch (e) {
      // ignore
    }
  };

  const handleClose = () => {
    setIsChatOpen(false);

    // Analytics: log conversion step reached
    trackEvent('chatbot_closed', {
      category,
      intent: intent.intent,
      conversion_step_reached: conversionStep,
      messages_sent: chatMessages.filter(m => m.role === 'user').length,
    });
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    setConversionStep(prev => prev + 1);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: chatMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          language: lang,
          source_page: sourcePage,
        }),
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || (lang === 'he' ? 'אופס, משהו השתבש. נסה שוב!' : 'Oops, something went wrong. Try again!'),
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: lang === 'he' ? 'סליחה, בעיה טכנית. נסה שוב בעוד רגע.' : 'Sorry, technical issue. Try again in a moment.',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const buttonText = {
    en: 'Chat with Talentr Assistant',
    he: 'שוחח עם עוזר Talentr',
  };

  const placeholderText = {
    en: 'Type your message...',
    he: 'הקלד את ההודעה שלך...',
  };

  return (
    <>
      {/* CTA Button */}
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <button
            onClick={handleOpen}
            className="group inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-base sm:text-lg font-bold">
              {buttonText[lang]}
            </span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </section>

      {/* Fullscreen Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-black"
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    Talentr Assistant
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {intent.intent !== 'general'
                      ? `${intent.category} ${lang === 'he' ? 'מומחה' : 'expert'}`
                      : lang === 'he' ? 'מוכן לעזור' : 'Ready to help'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3" style={{ height: 'calc(100vh - 140px)' }}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md shadow-lg shadow-blue-600/10'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1 border border-zinc-200 dark:border-zinc-700">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Suggested questions (show after welcome message, before user types) */}
              {chatMessages.length === 1 && chatMessages[0].role === 'assistant' && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {(intent.suggestedQuestions[lang] || intent.suggestedQuestions.en).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setChatInput(q);
                        // Auto-send after short delay
                        setTimeout(() => {
                          const fakeMsg: ChatMessage = {
                            id: Date.now().toString(),
                            role: 'user',
                            content: q,
                          };
                          setChatMessages(prev => [...prev, fakeMsg]);
                          setChatInput('');
                          setIsTyping(true);
                          setConversionStep(prev => prev + 1);

                          fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              message: q,
                              conversationHistory: chatMessages.map(m => ({ role: m.role, content: m.content })),
                              language: lang,
                              source_page: sourcePage,
                            }),
                          })
                            .then(r => r.json())
                            .then(data => {
                              setChatMessages(prev => [...prev, {
                                id: (Date.now() + 1).toString(),
                                role: 'assistant',
                                content: data.response || 'Something went wrong.',
                              }]);
                            })
                            .catch(() => {
                              setChatMessages(prev => [...prev, {
                                id: (Date.now() + 1).toString(),
                                role: 'assistant',
                                content: lang === 'he' ? 'בעיה טכנית, נסה שוב.' : 'Technical issue, try again.',
                              }]);
                            })
                            .finally(() => setIsTyping(false));
                        }, 100);
                      }}
                      className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-3 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 sm:gap-3 max-w-3xl mx-auto">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={placeholderText[lang]}
                  className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm sm:text-base placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-all"
                  autoFocus
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="w-11 h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90 flex-shrink-0"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

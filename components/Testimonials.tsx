'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    avatar: string;
    text: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Rachel & David',
        role: 'Wedding, Tel Aviv',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Talentr made planning our wedding so easy! We found an amazing photographer and DJ in just one day. The platform is intuitive and the professionals are top-notch.',
        rating: 5,
    },
    {
        id: '2',
        name: 'Michael S.',
        role: 'Corporate Event, Haifa',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Needed a magician and MC for our company party last minute. Talentr came through with incredible options. Our team is still talking about how fun the event was!',
        rating: 5,
    },
    {
        id: '3',
        name: 'Sarah L.',
        role: 'Bar Mitzvah, Jerusalem',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        text: 'Planning my son\'s Bar Mitzvah was stress-free thanks to Talentr. The decorator we hired transformed the venue beyond our expectations. Highly recommend!',
        rating: 5,
    },
];

export default function Testimonials() {
    const { language } = useLanguage();

    const sectionTitle = {
        en: 'What Our Clients Say',
        he: 'מה הלקוחות שלנו אומרים'
    };

    const sectionSubtitle = {
        en: 'Join thousands of happy customers who found their perfect event professionals',
        he: 'הצטרפו לאלפי לקוחות מרוצים שמצאו את אנשי המקצוע המושלמים'
    };

    return (
        <section className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
            <div className="absolute top-20 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6"
                    >
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                            {language === 'he' ? '4.9 מתוך 5 - ממוצע' : '4.9 out of 5 — Average Rating'}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4"
                    >
                        {sectionTitle[language as keyof typeof sectionTitle]}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        {sectionSubtitle[language as keyof typeof sectionSubtitle]}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-shadow"
                        >
                            <div className="absolute -top-4 left-8">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                    <Quote className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="flex gap-1 mb-4 pt-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900">
                                    <Image src={testimonial.avatar} alt={testimonial.name} fill sizes="48px" className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-slate-700"
                >
                    <div className="text-center">
                        <p className="text-4xl font-black text-blue-600 dark:text-blue-400">2,500+</p>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {language === 'he' ? 'אנשי מקצוע' : 'Professionals'}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-black text-purple-600 dark:text-purple-400">10,000+</p>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {language === 'he' ? 'אירועים' : 'Events Booked'}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-black text-green-600 dark:text-green-400">98%</p>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {language === 'he' ? 'שביעות רצון' : 'Satisfaction'}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-black text-orange-600 dark:text-orange-400">15+</p>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {language === 'he' ? 'ערים' : 'Cities'}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

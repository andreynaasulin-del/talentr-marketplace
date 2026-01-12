'use client';

import { useState } from 'react';
import { Star, ThumbsUp, User, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Review {
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    date: string;
    text: string;
    helpful: number;
    eventType: string;
}

interface ReviewsSectionProps {
    vendorId: string;
    vendorName: string;
    initialReviews?: Review[];
}

// Mock reviews removed - only real reviews from database are shown

export default function ReviewsSection({ vendorId, vendorName, initialReviews }: ReviewsSectionProps) {
    const { t, language } = useLanguage();
    const [reviews] = useState<Review[]>(initialReviews || []);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        text: '',
        eventType: 'Wedding'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.text.trim()) {
            toast.error('Please write a review');
            return;
        }

        setSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success(
            language === 'he'
                ? '✨ תודה על הביקורת!'
                : '✨ Thank you for your review!'
        );

        setNewReview({ rating: 5, text: '', eventType: 'Wedding' });
        setShowForm(false);
        setSubmitting(false);
    };

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    return (
        <div className="bg-zinc-900 rounded-[32px] p-8 border border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                        {language === 'he' ? 'ביקורות לקוחות' : 'Client Reviews'}
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-5 h-5",
                                        star <= Math.round(averageRating)
                                            ? "fill-blue-500 text-blue-500"
                                            : "text-zinc-700"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="font-black text-xl text-white">{averageRating.toFixed(1)}</span>
                        <span className="text-zinc-400 font-medium">({reviews.length} {t('reviews')})</span>
                    </div>
                </div>

                <motion.button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Star className="w-4 h-4" />
                    {language === 'he' ? 'כתוב ביקורת' : 'Write Review'}
                </motion.button>
            </div>

            {/* Review Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                        {/* Rating Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-zinc-400 mb-2">
                                Your Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Star
                                            className={cn(
                                                "w-8 h-8 cursor-pointer transition-colors",
                                                star <= newReview.rating
                                                    ? "fill-blue-500 text-blue-500"
                                                    : "text-zinc-700 hover:text-blue-400"
                                            )}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Event Type */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-zinc-400 mb-2">
                                Event Type
                            </label>
                            <select
                                value={newReview.eventType}
                                onChange={(e) => setNewReview({ ...newReview, eventType: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:outline-none font-medium text-white"
                            >
                                <option value="Wedding">{t('Wedding')}</option>
                                <option value="Bar Mitzvah">{t('Bar Mitzvah')}</option>
                                <option value="Birthday">{t('Birthday')}</option>
                                <option value="Corporate Event">{t('Corporate Event')}</option>
                                <option value="Private Party">{t('Private Party')}</option>
                            </select>
                        </div>

                        {/* Review Text */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-zinc-400 mb-2">
                                Your Review
                            </label>
                            <textarea
                                value={newReview.text}
                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                placeholder="Share your experience..."
                                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:outline-none font-medium text-white min-h-[120px] resize-none placeholder:text-zinc-600"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Review
                                </>
                            )}
                        </motion.button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 px-6"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                            <Star className="w-10 h-10 text-blue-500" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">
                            {language === 'he'
                                ? 'אין עדיין ביקורות'
                                : 'No reviews yet'}
                        </h4>
                        <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                            {language === 'he'
                                ? `היו הראשונים לכתוב ביקורת על ${vendorName}!`
                                : `Be the first to review ${vendorName}!`}
                        </p>
                        <motion.button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-blue-600/20"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Star className="w-4 h-4" />
                            {language === 'he' ? 'כתוב ביקורת' : 'Write a Review'}
                        </motion.button>
                    </motion.div>
                ) : (
                    reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold flex-shrink-0 border border-zinc-700">
                                    {review.author.charAt(0)}
                                </div>

                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-bold text-white">{review.author}</h4>
                                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                <span>{review.date}</span>
                                                <span>•</span>
                                                <span className="text-blue-500 font-medium">{t(review.eventType)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={cn(
                                                        "w-4 h-4",
                                                        star <= review.rating
                                                            ? "fill-blue-500 text-blue-500"
                                                            : "text-zinc-800"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <p className="text-zinc-300 leading-relaxed mb-4">{review.text}</p>

                                    {/* Helpful */}
                                    <motion.button
                                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-500 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>{t('Helpful')} ({review.helpful})</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Show More */}
            {reviews.length > 3 && (
                <motion.button
                    className="w-full mt-6 py-4 border border-zinc-800 rounded-xl text-zinc-400 font-bold hover:bg-zinc-800 hover:text-white transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    Show all reviews
                </motion.button>
            )}
        </div>
    );
}

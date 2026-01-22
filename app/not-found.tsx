'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black flex items-center justify-center p-6 transition-colors">
            <div className="max-w-lg w-full text-center">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[200px] font-black text-gray-100 dark:text-zinc-800 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 rotate-12">
                            <Search className="w-12 h-12 text-white -rotate-12" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed text-lg">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track!
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
                    <p className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Quick Links</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/" className="text-blue-600 dark:text-blue-500 hover:underline font-medium">Home</Link>
                        <Link href="/signin" className="text-blue-600 dark:text-blue-500 hover:underline font-medium">Sign In</Link>
                        <Link href="/join" className="text-blue-600 dark:text-blue-500 hover:underline font-medium">Join as Vendor</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

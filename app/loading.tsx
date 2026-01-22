export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-black dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center transition-colors">
            <div className="text-center">
                {/* Premium Loader */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse" />

                    {/* Spinning rings */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 animate-spin"
                        style={{ animationDuration: '1s' }} />
                    <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-purple-500 animate-spin"
                        style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-4 rounded-full border-[3px] border-transparent border-t-indigo-500 animate-spin"
                        style={{ animationDuration: '2s' }} />

                    {/* Center logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                T
                            </span>
                        </div>
                    </div>
                </div>

                {/* Loading text with shimmer */}
                <div className="relative overflow-hidden">
                    <p className="text-lg font-bold text-gray-400 dark:text-zinc-500">
                        Loading
                        <span className="inline-flex ml-1">
                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

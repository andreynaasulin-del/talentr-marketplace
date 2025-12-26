import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    {/* Animated gradient ring */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 animate-spin opacity-20 absolute inset-0" />
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl relative">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                </div>
                <p className="mt-6 text-gray-500 font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BlueAmbientBackground({ className = '' }: { className?: string }) {
    return (
        <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)} aria-hidden>
            {/* LAYER 1: Mesh gradient (same vibe as Hero) */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-100 blue-mesh"
                    style={{
                        background: `
                            radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 55%),
                            radial-gradient(at 97% 21%, hsla(195, 100%, 50%, 1) 0px, transparent 55%),
                            radial-gradient(at 52% 99%, hsla(196, 100%, 57%, 1) 0px, transparent 55%),
                            radial-gradient(at 10% 29%, hsla(195, 100%, 39%, 1) 0px, transparent 55%),
                            radial-gradient(at 97% 96%, hsla(195, 84%, 45%, 1) 0px, transparent 55%),
                            radial-gradient(at 33% 50%, hsla(195, 100%, 50%, 1) 0px, transparent 55%),
                            radial-gradient(at 79% 53%, hsla(196, 100%, 48%, 1) 0px, transparent 55%)
                        `,
                        animation: 'blueMeshMove 20s ease-in-out infinite',
                    }}
                />
            </div>

            {/* LAYER 2: Caustic light blobs (soft, premium) */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-[650px] h-[650px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        filter: 'blur(70px)',
                        top: '8%',
                        left: '12%',
                    }}
                    animate={{ x: [0, 55, -30, 0], y: [0, -45, 28, 0], scale: [1, 1.08, 0.96, 1] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.div
                    className="absolute w-[520px] h-[520px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(72,202,228,0.10) 0%, transparent 70%)',
                        filter: 'blur(90px)',
                        top: '52%',
                        right: '10%',
                    }}
                    animate={{ x: [0, -65, 40, 0], y: [0, 45, -35, 0], scale: [1, 0.92, 1.06, 1] }}
                    transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                />
            </div>

            {/* LAYER 3: Floating glass orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-28 h-28 rounded-full backdrop-blur-md border border-white/10"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16), rgba(255,255,255,0.02))',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.22)',
                        top: '22%',
                        left: '10%',
                    }}
                    animate={{ y: [0, -30, 0], x: [0, 14, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.div
                    className="absolute w-20 h-20 rounded-full backdrop-blur-md border border-white/10"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.18)',
                        top: '62%',
                        right: '14%',
                    }}
                    animate={{ y: [0, -36, 0], x: [0, -16, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
            </div>

            {/* LAYER 4: Subtle noise */}
            <div
                className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            <style jsx>{`
                @keyframes blueMeshMove {
                    0%, 100% {
                        background-position: 0% 0%, 100% 100%, 50% 0%, 0% 100%, 100% 0%, 33% 50%, 79% 53%;
                    }
                    25% {
                        background-position: 50% 50%, 80% 20%, 40% 90%, 10% 80%, 90% 10%, 45% 60%, 85% 45%;
                    }
                    50% {
                        background-position: 100% 100%, 0% 0%, 50% 100%, 100% 0%, 0% 100%, 66% 50%, 21% 47%;
                    }
                    75% {
                        background-position: 50% 50%, 20% 80%, 60% 10%, 90% 20%, 10% 90%, 55% 40%, 15% 55%;
                    }
                }
            `}</style>
        </div>
    );
}



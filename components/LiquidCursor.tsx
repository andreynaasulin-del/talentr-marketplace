'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LiquidCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for smooth following
    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Only show on desktop
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isMobile || prefersReducedMotion) {
            return;
        }

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 12); // Center the 24px cursor
            cursorY.set(e.clientY - 12);
        };

        const handleMouseEnter = (e: Event) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main cursor orb */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                {/* Outer glow */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: 24,
                        height: 24,
                        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                    }}
                    animate={{
                        scale: isHovering ? 2.5 : 1,
                        opacity: isHovering ? 0.8 : 0.5,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                {/* Core dot */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: 8,
                        height: 8,
                        left: 8,
                        top: 8,
                        background: 'linear-gradient(135deg, #00d4ff 0%, #009de0 100%)',
                        boxShadow: '0 0 10px rgba(0, 212, 255, 0.6)',
                    }}
                    animate={{
                        scale: isHovering ? 2 : 1,
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                />
            </motion.div>

            {/* Hide default cursor on interactive elements */}
            <style jsx global>{`
                @media (min-width: 769px) {
                    body {
                        cursor: none !important;
                    }
                    a, button, [role="button"], .cursor-pointer,
                    input, textarea, select {
                        cursor: none !important;
                    }
                }
            `}</style>
        </>
    );
}

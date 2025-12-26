'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import {
    staggerContainer,
    staggerItem,
    springs,
} from '@/lib/animations';

// ===== ANIMATED CONTAINER (Stagger Children) =====
interface AnimatedContainerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    staggerAmount?: number;
}

export function AnimatedContainer({
    children,
    className = '',
    delay = 0,
    staggerAmount = 0.08,
}: AnimatedContainerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            variants={staggerContainer(delay, staggerAmount)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ===== ANIMATED ITEM (For inside StaggerContainer) =====
interface AnimatedItemProps {
    children: ReactNode;
    className?: string;
}

export function AnimatedItem({ children, className = '' }: AnimatedItemProps) {
    return (
        <motion.div variants={staggerItem} className={className}>
            {children}
        </motion.div>
    );
}

// ===== FADE UP ON SCROLL =====
interface FadeUpProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FadeUp({ children, className = '', delay = 0 }: FadeUpProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { ...springs.smooth, delay }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ===== PARALLAX SCROLL =====
interface ParallaxProps {
    children: ReactNode;
    className?: string;
    speed?: number; // 0.5 = half speed, 2 = double speed
}

export function Parallax({ children, className = '', speed = 0.5 }: ParallaxProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <motion.div ref={ref} style={{ y: smoothY }} className={className}>
            {children}
        </motion.div>
    );
}

// ===== SCALE ON SCROLL =====
interface ScaleOnScrollProps {
    children: ReactNode;
    className?: string;
}

export function ScaleOnScroll({ children, className = '' }: ScaleOnScrollProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'center center']
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const smoothScale = useSpring(scale, springs.smooth);

    return (
        <motion.div
            ref={ref}
            style={{ scale: smoothScale, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ===== MAGNETIC HOVER =====
interface MagneticProps {
    children: ReactNode;
    className?: string;
    strength?: number;
}

export function Magnetic({ children, className = '', strength = 0.3 }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'translate(0, 0)';
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            style={{ transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
            {children}
        </motion.div>
    );
}

// ===== TEXT REVEAL CHARACTER BY CHARACTER =====
interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TextReveal({
    text,
    className = '',
    delay = 0,
    as: Component = 'span'
}: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const words = text.split(' ');

    return (
        <Component ref={ref} className={className}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block overflow-hidden">
                    <motion.span
                        className="inline-block"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{
                            duration: 0.5,
                            delay: delay + wordIndex * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        {word}
                    </motion.span>
                    {wordIndex < words.length - 1 && '\u00A0'}
                </span>
            ))}
        </Component>
    );
}

// ===== COUNTER ANIMATION =====
interface CounterProps {
    from?: number;
    to: number;
    duration?: number;
    className?: string;
    suffix?: string;
    prefix?: string;
}

export function Counter({
    from = 0,
    to,
    duration = 2,
    className = '',
    suffix = '',
    prefix = ''
}: CounterProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const count = useSpring(from, {
        stiffness: 50,
        damping: 20,
    });

    if (isInView) {
        count.set(to);
    }

    return (
        <motion.span ref={ref} className={className}>
            {prefix}
            <motion.span>
                {Math.round(count.get())}
            </motion.span>
            {suffix}
        </motion.span>
    );
}

// ===== GLOW EFFECT ON HOVER =====
interface GlowCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;
}

export function GlowCard({
    children,
    className = '',
    glowColor = 'rgba(59, 130, 246, 0.4)'
}: GlowCardProps) {
    return (
        <motion.div
            className={`relative ${className}`}
            whileHover={{
                boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}`,
            }}
            transition={springs.snappy}
        >
            {children}
        </motion.div>
    );
}

// ===== SHAKE ANIMATION =====
export function useShake() {
    return {
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };
}

// ===== BLUR IN =====
interface BlurInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function BlurIn({ children, className = '', delay = 0 }: BlurInProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ===== FLIP CARD =====
interface FlipCardProps {
    front: ReactNode;
    back: ReactNode;
    className?: string;
}

export function FlipCard({ front, back, className = '' }: FlipCardProps) {
    return (
        <motion.div
            className={`relative preserve-3d ${className}`}
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
            style={{ perspective: 1000 }}
        >
            <div className="absolute inset-0 backface-hidden">
                {front}
            </div>
            <div
                className="absolute inset-0 backface-hidden"
                style={{ transform: 'rotateY(180deg)' }}
            >
                {back}
            </div>
        </motion.div>
    );
}

// ===== MORPHING BACKGROUND =====
export function MorphingBlob({ className = '' }: { className?: string }) {
    return (
        <motion.div
            className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
            animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
                borderRadius: ['50%', '40%', '50%'],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
}

// ===== CURSOR FOLLOW =====
interface CursorFollowProps {
    children: ReactNode;
    className?: string;
}

export function CursorFollow({ children, className = '' }: CursorFollowProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

        el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    const handleMouseLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            style={{
                transition: 'transform 0.3s ease-out',
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
        </motion.div>
    );
}

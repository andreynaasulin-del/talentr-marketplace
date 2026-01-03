'use client';

import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from 'framer-motion';
import { useRef, ReactNode, useState, MouseEvent } from 'react';
import {
    staggerContainer,
    staggerItem,
    springs,
} from '@/lib/animations';
import { cn } from '@/lib/utils';

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

// ===== LUXURY GLASS CARD =====
interface GlassCardLuxuryProps {
    children: ReactNode;
    className?: string;
    glowOnHover?: boolean;
    tilt?: boolean;
}

export function GlassCardLuxury({ 
    children, 
    className = '', 
    glowOnHover = true,
    tilt = false,
}: GlassCardLuxuryProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { stiffness: 150, damping: 20 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
    
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current || !tilt) return;
        
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        
        mouseX.set(x);
        mouseY.set(y);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={cn(
                "relative overflow-hidden rounded-3xl",
                "bg-white/10 dark:bg-slate-900/30",
                "backdrop-blur-xl",
                "border border-white/20 dark:border-white/10",
                "shadow-xl",
                className
            )}
            style={tilt ? {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            } : undefined}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            whileHover={glowOnHover ? { 
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.2), 0 0 80px rgba(0, 157, 224, 0.1)',
            } : undefined}
            transition={{ duration: 0.5 }}
        >
            {/* Animated gradient border on hover */}
            {glowOnHover && (
                <motion.div 
                    className="absolute inset-0 rounded-3xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), transparent, rgba(0, 157, 224, 0.3))',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                    }}
                />
            )}
            
            {/* Shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <motion.div 
                    className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg]"
                    animate={isHovered ? { left: '200%' } : { left: '-100%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

// ===== GLOW BUTTON =====
interface GlowButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export function GlowButton({ 
    children, 
    className = '', 
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
}: GlowButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };
    
    const variantClasses = {
        primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
        secondary: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
        ghost: 'bg-transparent text-cyan-400 hover:bg-cyan-500/10',
    };

    return (
        <motion.button
            className={cn(
                "relative overflow-hidden rounded-xl font-semibold",
                "transition-all duration-300",
                sizeClasses[size],
                variantClasses[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Glow effect */}
            {variant === 'primary' && (
                <motion.div 
                    className="absolute inset-0 rounded-xl"
                    style={{
                        boxShadow: isHovered 
                            ? '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 157, 224, 0.3)' 
                            : '0 0 15px rgba(0, 212, 255, 0.3)',
                        transition: 'box-shadow 0.3s ease',
                    }}
                />
            )}
            
            {/* Animated gradient */}
            {variant === 'primary' && (
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={{ backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%' }}
                    transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatType: 'reverse' }}
                />
            )}
            
            {/* Ripple effect container */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                <motion.div 
                    className="absolute top-0 -left-full w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg]"
                    animate={isHovered ? { left: '200%' } : { left: '-100%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>
            
            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}

// ===== ANIMATED BORDER =====
interface AnimatedBorderProps {
    children: ReactNode;
    className?: string;
    borderWidth?: number;
    duration?: number;
}

export function AnimatedBorder({ 
    children, 
    className = '',
    borderWidth = 2,
    duration = 4,
}: AnimatedBorderProps) {
    return (
        <div className={cn("relative", className)}>
            {/* Animated gradient border */}
            <motion.div 
                className="absolute inset-0 rounded-[inherit]"
                style={{
                    padding: borderWidth,
                    background: 'conic-gradient(from 0deg, #00d4ff, #009de0, #0077b6, #00d4ff)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Content container */}
            <div className="relative bg-inherit rounded-[inherit]">
                {children}
            </div>
        </div>
    );
}

// ===== SPOTLIGHT CARD =====
interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            ref={ref}
            className={cn(
                "relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800",
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Spotlight effect */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: `radial-gradient(
                        400px circle at ${mousePosition.x}px ${mousePosition.y}px,
                        rgba(0, 212, 255, 0.15),
                        transparent 60%
                    )`,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            />
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

// ===== FLOATING ELEMENT =====
interface FloatingElementProps {
    children: ReactNode;
    className?: string;
    amplitude?: number;
    duration?: number;
    delay?: number;
}

export function FloatingElement({ 
    children, 
    className = '', 
    amplitude = 20,
    duration = 6,
    delay = 0,
}: FloatingElementProps) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -amplitude, 0],
                rotate: [0, 2, -2, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    );
}

// ===== REVEAL CONTAINER =====
interface RevealContainerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function RevealContainer({ children, className = '', delay = 0 }: RevealContainerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                filter: 'blur(0px)',
            } : {}}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

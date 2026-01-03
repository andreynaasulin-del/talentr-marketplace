'use client';

import { useEffect, useState, useRef, RefObject, useCallback } from 'react';

/**
 * useScrollProgress - Track scroll progress within viewport
 * Returns a value from 0 to 1 based on element position in viewport
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the element has scrolled through the viewport
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Progress: 0 when element enters bottom, 1 when it exits top
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      ));
      
      setProgress(progress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [ref]);

  return progress;
}

/**
 * useParallax - Create parallax effect based on scroll
 * @param speed - Parallax speed multiplier (0.1 = slow, 1 = normal scroll speed)
 */
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const relativeScroll = scrolled - elementTop + window.innerHeight;
      
      // Only apply parallax when element is in view
      if (relativeScroll > 0 && rect.top < window.innerHeight) {
        setOffset(relativeScroll * speed);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
}

/**
 * use3DTilt - 3D tilt effect following mouse cursor
 * Creates perspective transform based on mouse position
 */
export function use3DTilt(options: {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  glareMaxOpacity?: number;
} = {}) {
  const {
    max = 15,
    perspective = 1000,
    scale = 1.02,
    speed = 400,
    glare = true,
    glareMaxOpacity = 0.3,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (-mouseY / (rect.height / 2)) * max;
    const rotateY = (mouseX / (rect.width / 2)) * max;
    
    // Glare position (percentage)
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTransform({ rotateX, rotateY, scale });
    setGlarePosition({ x: glareX, y: glareY });
  }, [max, scale]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlarePosition({ x: 50, y: 50 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  const style = {
    transform: `
      perspective(${perspective}px) 
      rotateX(${transform.rotateX}deg) 
      rotateY(${transform.rotateY}deg) 
      scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})
    `,
    transition: `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transformStyle: 'preserve-3d' as const,
  };

  const glareStyle = glare ? {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    background: `radial-gradient(
      circle at ${glarePosition.x}% ${glarePosition.y}%,
      rgba(255, 255, 255, ${isHovered ? glareMaxOpacity : 0}) 0%,
      transparent 60%
    )`,
    pointerEvents: 'none' as const,
    transition: `opacity ${speed}ms ease`,
    zIndex: 1,
  } : null;

  return { ref, style, glareStyle, isHovered };
}

/**
 * useMousePosition - Track mouse position relative to element
 */
export function useMousePosition(ref: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };

    element.addEventListener('mousemove', handleMouseMove);
    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, [ref]);

  return position;
}

/**
 * useInView - Track if element is in viewport
 */
export function useInView(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        setHasAnimated(true);
      } else {
        setIsInView(false);
      }
    }, { threshold: 0.1, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView, hasAnimated };
}

/**
 * useStaggeredAnimation - Create staggered animation delays
 */
export function useStaggeredAnimation(itemCount: number, baseDelay: number = 100) {
  return Array.from({ length: itemCount }, (_, i) => ({
    delay: i * baseDelay,
    style: { animationDelay: `${i * baseDelay}ms` },
  }));
}


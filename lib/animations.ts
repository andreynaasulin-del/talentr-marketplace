/**
 * 🎬 TALENTR ANIMATION SYSTEM
 * Premium Framer Motion presets for consistent, polished animations
 */

import { Variants, Transition } from 'framer-motion';

// ===== SPRING PHYSICS PRESETS =====
export const springs = {
    // Snappy - Quick response, minimal overshoot (buttons, toggles)
    snappy: { type: 'spring', stiffness: 400, damping: 30 } as Transition,

    // Bouncy - Playful, noticeable bounce (success states, cards)
    bouncy: { type: 'spring', stiffness: 300, damping: 20 } as Transition,

    // Smooth - Gentle, natural feel (page transitions, modals)
    smooth: { type: 'spring', stiffness: 200, damping: 25 } as Transition,

    // Slow - Dramatic, cinematic (hero sections, reveals)
    slow: { type: 'spring', stiffness: 100, damping: 20 } as Transition,

    // Elastic - High overshoot (celebrations, notifications)
    elastic: { type: 'spring', stiffness: 500, damping: 15 } as Transition,
};

// ===== EASING PRESETS =====
// Cast as const for proper tuple types
export const easings = {
    easeOutExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
    easeOutQuart: [0.25, 1, 0.5, 1] as [number, number, number, number],
    easeInOutSine: [0.37, 0, 0.63, 1] as [number, number, number, number],
    easeOutBack: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
};

// ===== DURATION PRESETS =====
export const durations = {
    instant: 0.1,
    fast: 0.2,
    normal: 0.35,
    slow: 0.5,
    dramatic: 0.8,
};

// ===== STAGGER PRESETS =====
export const stagger = {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12,
    dramatic: 0.2,
};

// ===== FADE VARIANTS =====
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: durations.normal, ease: easings.easeOutQuart }
    },
    exit: {
        opacity: 0,
        transition: { duration: durations.fast }
    }
};

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springs.smooth
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: durations.fast }
    }
};

export const fadeDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springs.smooth
    },
};

export const fadeScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springs.bouncy
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: durations.fast }
    }
};

// ===== SLIDE VARIANTS =====
export const slideIn = {
    left: {
        hidden: { x: -60, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: springs.smooth },
        exit: { x: -30, opacity: 0 }
    } as Variants,
    right: {
        hidden: { x: 60, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: springs.smooth },
        exit: { x: 30, opacity: 0 }
    } as Variants,
    up: {
        hidden: { y: 60, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: springs.smooth },
        exit: { y: -30, opacity: 0 }
    } as Variants,
    down: {
        hidden: { y: -60, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: springs.smooth },
        exit: { y: 30, opacity: 0 }
    } as Variants,
};

// ===== SCALE VARIANTS =====
export const scaleIn: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: springs.bouncy
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: durations.fast }
    }
};

export const popIn: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: springs.elastic
    },
};

// ===== STAGGER CONTAINER VARIANTS =====
export const staggerContainer = (delayChildren = 0, staggerAmount = stagger.normal): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren,
            staggerChildren: staggerAmount,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: stagger.fast,
            staggerDirection: -1,
        }
    }
});

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springs.bouncy
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: durations.fast }
    }
};

// ===== HOVER ANIMATIONS =====
export const hoverScale = {
    scale: 1.02,
    transition: springs.snappy,
};

export const hoverLift = {
    y: -4,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    transition: springs.snappy,
};

export const hoverGlow = (color: string = 'rgba(59, 130, 246, 0.4)') => ({
    boxShadow: `0 0 30px ${color}`,
    transition: springs.snappy,
});

// ===== TAP ANIMATIONS =====
export const tapScale = {
    scale: 0.97,
};

export const tapPush = {
    scale: 0.95,
    y: 2,
};

// ===== CARD VARIANTS =====
export const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: springs.bouncy
    },
    hover: {
        y: -8,
        scale: 1.02,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        transition: springs.snappy,
    },
    tap: {
        scale: 0.98,
    }
};

// ===== BUTTON VARIANTS =====
export const buttonVariants: Variants = {
    idle: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: springs.snappy
    },
    tap: {
        scale: 0.97,
        transition: { duration: 0.1 }
    },
    disabled: {
        opacity: 0.5,
        scale: 1,
    }
};

// ===== MODAL VARIANTS =====
export const modalOverlay: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: durations.normal }
    },
    exit: {
        opacity: 0,
        transition: { duration: durations.fast, delay: 0.1 }
    }
};

export const modalContent: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springs.bouncy
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: durations.fast }
    }
};

// ===== DRAWER VARIANTS =====
export const drawer = {
    bottom: {
        hidden: { y: '100%' },
        visible: { y: 0, transition: springs.smooth },
        exit: { y: '100%', transition: { duration: durations.fast } }
    } as Variants,
    right: {
        hidden: { x: '100%' },
        visible: { x: 0, transition: springs.smooth },
        exit: { x: '100%', transition: { duration: durations.fast } }
    } as Variants,
    left: {
        hidden: { x: '-100%' },
        visible: { x: 0, transition: springs.smooth },
        exit: { x: '-100%', transition: { duration: durations.fast } }
    } as Variants,
};

// ===== NOTIFICATION VARIANTS =====
export const notification: Variants = {
    hidden: {
        opacity: 0,
        y: -20,
        scale: 0.9,
        x: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        x: 0,
        transition: springs.elastic
    },
    exit: {
        opacity: 0,
        x: 100,
        transition: { duration: durations.fast }
    }
};

// ===== SKELETON SHIMMER =====
export const shimmer: Variants = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
        }
    }
};

// ===== PAGE TRANSITION VARIANTS =====
export const pageTransition: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.normal,
            ease: easings.easeOutExpo,
            staggerChildren: stagger.normal,
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: durations.fast }
    }
};

// ===== HERO SECTION VARIANTS =====
export const heroVariants = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    } as Variants,
    headline: {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: springs.slow
        }
    } as Variants,
    subtext: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: springs.smooth
        }
    } as Variants,
    cta: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: springs.bouncy
        }
    } as Variants,
};

// ===== ICON ANIMATIONS =====
export const iconSpin: Variants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        }
    }
};

export const iconPulse: Variants = {
    animate: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.6,
            repeat: Infinity,
        }
    }
};

export const iconBounce: Variants = {
    animate: {
        y: [0, -8, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: easings.easeOutQuart,
        }
    }
};

// ===== TEXT REVEAL =====
export const textReveal: Variants = {
    hidden: {
        opacity: 0,
        y: '100%',
    },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: durations.normal,
            ease: easings.easeOutQuart,
        }
    })
};

// ===== FLOATING ANIMATION =====
export const float = (duration = 6, yOffset = 20): Variants => ({
    animate: {
        y: [0, -yOffset, 0],
        transition: {
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
        }
    }
});

// ===== GRADIENT SHIFT =====
export const gradientShift: Variants = {
    animate: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
        }
    }
};

// ===== SUCCESS CHECKMARK =====
export const checkmark = {
    circle: {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    } as Variants,
    check: {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.3, delay: 0.4, ease: 'easeOut' }
        }
    } as Variants,
};

// ===== SCROLL TRIGGERED VARIANTS =====
export const scrollReveal: Variants = {
    hidden: {
        opacity: 0,
        y: 60,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.slow,
            ease: easings.easeOutExpo,
        }
    }
};

// ===== VIEWPORT CONFIG =====
export const viewport = {
    once: true,
    amount: 0.2,
    margin: '-50px',
};

export const viewportReplay = {
    once: false,
    amount: 0.3,
};

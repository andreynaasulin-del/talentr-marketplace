import { z } from 'zod';

// ===== BOOKING SCHEMA =====
export const bookingSchema = z.object({
    vendorId: z.string().min(1, 'Vendor ID is required'),
    eventDate: z.string().min(1, 'Event date is required').refine((date) => {
        const eventDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
    }, 'Event date must be in the future'),
    eventType: z.string().min(1, 'Event type is required'),
    details: z.string().max(1000, 'Details must be less than 1000 characters').optional(),
    clientName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    clientEmail: z.string().email('Invalid email address'),
    clientPhone: z.string().regex(/^[+]?[\d\s-()]{7,20}$/, 'Invalid phone number').optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ===== AUTH SCHEMAS =====
export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const vendorSignUpSchema = signUpSchema.extend({
    category: z.string().min(1, 'Category is required'),
    city: z.string().min(1, 'City is required'),
    phone: z.string().regex(/^[+]?[\d\s-()]{7,20}$/, 'Invalid phone number'),
    portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type VendorSignUpFormData = z.infer<typeof vendorSignUpSchema>;

// ===== REVIEW SCHEMA =====
export const reviewSchema = z.object({
    vendorId: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, 'Review must be at least 10 characters').max(500),
    authorName: z.string().min(2).max(100),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ===== CONTACT SCHEMA =====
export const contactSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Invalid email'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ===== CHAT/AI SCHEMA =====
export const chatMessageSchema = z.object({
    message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
    language: z.enum(['en', 'he']).default('en'),
});

export type ChatMessageData = z.infer<typeof chatMessageSchema>;

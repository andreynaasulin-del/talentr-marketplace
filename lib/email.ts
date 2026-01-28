import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = 'Talentr <noreply@talentr.co.il>';

// =============================================
// EMAIL TYPES
// =============================================

interface InviteEmailData {
    vendorName: string;
    vendorEmail: string;
    confirmLink: string;
    category?: string;
}

interface MagicLinkEmailData {
    vendorName: string;
    vendorEmail: string;
    editLink: string;
}

interface BookingNotificationData {
    vendorName: string;
    vendorEmail: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    gigTitle: string;
    eventDate?: string;
    eventType?: string;
    guestsCount?: number;
    message?: string;
    dashboardLink: string;
}

interface BookingStatusData {
    clientName: string;
    clientEmail: string;
    vendorName: string;
    gigTitle: string;
    status: 'confirmed' | 'rejected';
    vendorResponse?: string;
    quotedPrice?: number;
}

// =============================================
// HELPER
// =============================================

function isEmailConfigured(): boolean {
    return !!resend;
}

// =============================================
// SEND FUNCTIONS (Server-side only)
// =============================================

/**
 * Send invitation email to pending vendor
 */
export async function sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('Email not configured, skipping invite email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { vendorName, vendorEmail, confirmLink, category } = data;

        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: vendorEmail,
            subject: `🎉 ${vendorName}, you're invited to join Talentr!`,
            html: `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: #3b82f6;">Talentr</h1>
            </div>
            
            <h2 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0 0 16px 0; text-align: center;">
                שלום ${vendorName}! 👋
            </h2>
            
            <p style="font-size: 16px; color: #52525b; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                מצאנו את הפרופיל שלך ונראה לנו שאתה מתאים בול לפלטפורמה שלנו${category ? ` בקטגוריית <strong>${category}</strong>` : ''}.
            </p>
            
            <p style="font-size: 16px; color: #52525b; line-height: 1.6; margin: 0 0 32px 0; text-align: center;">
                Talentr היא פלטפורמה המחברת בין מפיקי אירועים לאמנים ונותני שירות מובילים בישראל.
            </p>
            
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${confirmLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 12px;">
                    צפה בפרופיל שלך ←
                </a>
            </div>
            
            <p style="font-size: 14px; color: #a1a1aa; text-align: center; margin: 0;">
                הקישור תקף ל-30 יום
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
            <p style="font-size: 12px; color: #a1a1aa; margin: 0;">© 2024 Talentr</p>
        </div>
    </div>
</body>
</html>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Email send error:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

/**
 * Send magic link email to vendor (after confirmation or recovery)
 */
export async function sendMagicLinkEmail(data: MagicLinkEmailData): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('Email not configured, skipping magic link email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { vendorName, vendorEmail, editLink } = data;

        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: vendorEmail,
            subject: `🔐 הקישור שלך לדאשבורד Talentr`,
            html: `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: #3b82f6;">Talentr</h1>
            </div>
            
            <h2 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0 0 16px 0; text-align: center;">
                הקישור שלך לדאשבורד 🔗
            </h2>
            
            <p style="font-size: 16px; color: #52525b; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                שלום ${vendorName}, הנה הקישור לניהול הפרופיל שלך:
            </p>
            
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${editLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 12px;">
                    כניסה לדאשבורד ←
                </a>
            </div>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="font-size: 14px; color: #92400e; margin: 0; text-align: center;">
                    ⚠️ שמור על הקישור הזה בסוד. כל מי שיש לו גישה אליו יכול לערוך את הפרופיל שלך.
                </p>
            </div>
            
            <p style="font-size: 14px; color: #a1a1aa; text-align: center; margin: 0;">
                לא ביקשת את הקישור הזה? התעלם מהמייל הזה.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
            <p style="font-size: 12px; color: #a1a1aa; margin: 0;">© 2024 Talentr</p>
        </div>
    </div>
</body>
</html>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Email send error:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

/**
 * Send booking notification to vendor
 */
export async function sendBookingNotificationEmail(data: BookingNotificationData): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('Email not configured, skipping booking notification');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: data.vendorEmail,
            subject: `🎉 בקשת הזמנה חדשה מ-${data.clientName}!`,
            html: `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: #3b82f6;">Talentr</h1>
            </div>
            
            <h2 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0 0 16px 0; text-align: center;">
                יש לך בקשת הזמנה חדשה! 🎊
            </h2>
            
            <p style="font-size: 16px; color: #52525b; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                שלום ${data.vendorName}, קיבלת בקשה חדשה עבור <strong>${data.gigTitle}</strong>
            </p>
            
            <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="font-size: 16px; font-weight: 600; color: #18181b; margin: 0 0 16px 0;">פרטי הלקוח:</h3>
                <p style="margin: 8px 0;"><strong>👤 שם:</strong> ${data.clientName}</p>
                <p style="margin: 8px 0;"><strong>📧 אימייל:</strong> <a href="mailto:${data.clientEmail}" style="color: #3b82f6;">${data.clientEmail}</a></p>
                ${data.clientPhone ? `<p style="margin: 8px 0;"><strong>📱 טלפון:</strong> <a href="tel:${data.clientPhone}" style="color: #3b82f6;">${data.clientPhone}</a></p>` : ''}
                ${data.eventDate ? `<p style="margin: 8px 0;"><strong>📅 תאריך:</strong> ${data.eventDate}</p>` : ''}
                ${data.eventType ? `<p style="margin: 8px 0;"><strong>🎉 סוג אירוע:</strong> ${data.eventType}</p>` : ''}
                ${data.guestsCount ? `<p style="margin: 8px 0;"><strong>👥 מספר אורחים:</strong> ${data.guestsCount}</p>` : ''}
                ${data.message ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e4e4e7;"><p style="font-weight: 500;">💬 הודעה:</p><p style="font-style: italic;">"${data.message}"</p></div>` : ''}
            </div>
            
            <div style="text-align: center; margin-bottom: 24px;">
                <a href="${data.dashboardLink}" style="display: inline-block; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 12px;">
                    צפה בבקשה בדאשבורד ←
                </a>
            </div>
            
            <p style="font-size: 14px; color: #a1a1aa; text-align: center; margin: 0;">
                מומלץ לענות תוך 24 שעות לשיפור הדירוג שלך!
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
            <p style="font-size: 12px; color: #a1a1aa; margin: 0;">© 2024 Talentr</p>
        </div>
    </div>
</body>
</html>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Email send error:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

/**
 * Send booking status update to client
 */
export async function sendBookingStatusEmail(data: BookingStatusData): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('Email not configured, skipping status email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const isConfirmed = data.status === 'confirmed';
        const subject = isConfirmed
            ? `✅ ההזמנה שלך אושרה על ידי ${data.vendorName}!`
            : `עדכון לגבי ההזמנה שלך`;

        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: data.clientEmail,
            subject,
            html: `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: #3b82f6;">Talentr</h1>
            </div>
            
            <div style="text-align: center; margin-bottom: 24px; font-size: 48px;">
                ${isConfirmed ? '✅' : '❌'}
            </div>
            
            <h2 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0 0 16px 0; text-align: center;">
                ${isConfirmed ? 'ההזמנה שלך אושרה!' : 'ההזמנה לא אושרה'}
            </h2>
            
            <p style="font-size: 16px; color: #52525b; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                שלום ${data.clientName}, ${isConfirmed
                    ? `<strong>${data.vendorName}</strong> אישר/ה את הבקשה שלך עבור <strong>${data.gigTitle}</strong>!`
                    : `לצערנו <strong>${data.vendorName}</strong> לא יכול/ה לקבל את ההזמנה עבור <strong>${data.gigTitle}</strong>.`}
            </p>
            
            ${data.vendorResponse ? `
            <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="font-weight: 500;">💬 הודעה מהספק:</p>
                <p style="font-style: italic;">"${data.vendorResponse}"</p>
            </div>
            ` : ''}
            
            ${isConfirmed && data.quotedPrice ? `
            <div style="background: #dcfce7; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
                <p style="font-size: 14px; color: #166534; margin: 0 0 8px 0;">מחיר מוצע:</p>
                <p style="font-size: 32px; font-weight: 700; color: #166534; margin: 0;">₪${data.quotedPrice.toLocaleString()}</p>
            </div>
            ` : ''}
            
            <p style="font-size: 14px; color: #52525b; text-align: center; margin: 0;">
                ${isConfirmed
                    ? 'הספק ייצור איתך קשר בקרוב לסיכום פרטים אחרונים 📞'
                    : `אל דאגה! יש עוד הרבה ספקים מעולים ב-Talentr. <a href="https://talentr.co.il" style="color: #3b82f6;">חפש עוד →</a>`
                }
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
            <p style="font-size: 12px; color: #a1a1aa; margin: 0;">© 2024 Talentr</p>
        </div>
    </div>
</body>
</html>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Email send error:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// =============================================
// LEGACY CLIENT-SIDE FUNCTIONS (for backwards compatibility)
// =============================================

interface BookingEmailData {
    clientEmail: string;
    clientName: string;
    vendorEmail?: string;
    vendorName: string;
    eventDate: string;
    eventType: string;
    message?: string;
}

interface StatusUpdateEmailData {
    clientEmail: string;
    clientName: string;
    vendorName: string;
    eventDate: string;
    eventType: string;
    status: 'confirmed' | 'declined' | 'completed';
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
    try {
        const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                template: 'booking_confirmation',
                to: data.clientEmail,
                vendorName: data.vendorName,
                clientName: data.clientName,
                eventDate: data.eventDate,
                eventType: data.eventType,
                message: data.message || '',
            }),
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Failed to send booking confirmation:', error);
        return false;
    }
}

export async function sendVendorNotification(data: BookingEmailData): Promise<boolean> {
    if (!data.vendorEmail) return false;
    try {
        const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                template: 'vendor_notification',
                to: data.vendorEmail,
                vendorName: data.vendorName,
                clientName: data.clientName,
                eventDate: data.eventDate,
                eventType: data.eventType,
                message: data.message || '',
            }),
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Failed to send vendor notification:', error);
        return false;
    }
}

export async function sendStatusUpdate(data: StatusUpdateEmailData): Promise<boolean> {
    try {
        const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                template: 'booking_status_update',
                to: data.clientEmail,
                vendorName: data.vendorName,
                clientName: data.clientName,
                eventDate: data.eventDate,
                eventType: data.eventType,
                status: data.status,
                message: '',
            }),
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Failed to send status update:', error);
        return false;
    }
}

export async function sendBookingEmails(data: BookingEmailData): Promise<{ clientSent: boolean; vendorSent: boolean }> {
    const [clientSent, vendorSent] = await Promise.all([
        sendBookingConfirmation(data),
        sendVendorNotification(data),
    ]);
    return { clientSent, vendorSent };
}

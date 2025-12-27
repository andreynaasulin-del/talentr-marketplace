// Email notification utility functions

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

/**
 * Send booking confirmation email to client
 */
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

/**
 * Send new booking notification to vendor
 */
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

/**
 * Send booking status update to client
 */
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

/**
 * Send both client confirmation and vendor notification for a new booking
 */
export async function sendBookingEmails(data: BookingEmailData): Promise<{ clientSent: boolean; vendorSent: boolean }> {
    const [clientSent, vendorSent] = await Promise.all([
        sendBookingConfirmation(data),
        sendVendorNotification(data),
    ]);

    return { clientSent, vendorSent };
}

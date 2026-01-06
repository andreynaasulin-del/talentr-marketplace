import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend (will work in production with RESEND_API_KEY)
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

interface EmailRequest {
    to: string;
    subject: string;
    vendorName: string;
    clientName: string;
    eventDate: string;
    eventType: string;
    message: string;
}

// Beautiful email templates
const templates = {
    booking_confirmation: (data: EmailRequest) => ({
        subject: `✅ Booking Confirmed - ${data.vendorName}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 32px; font-weight: 900; color: #1a1a1a; margin: 0;">Talentr</h1>
                    <p style="color: #666; font-size: 14px;">Event Marketplace</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 10px 0; font-size: 24px;">Booking Confirmed! 🎉</h2>
                    <p style="margin: 0; opacity: 0.9;">Your event is all set</p>
                </div>
                
                <div style="background: #f8fafc; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px;">Booking Details</h3>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Vendor</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${data.vendorName}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Event Date</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${data.eventDate}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Event Type</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${data.eventType}</p>
                    </div>
                    
                    ${data.message ? `
                    <div>
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 14px; background: white; padding: 16px; border-radius: 8px;">${data.message}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="https://event-marketplace-mvp.vercel.app/bookings" 
                       style="display: inline-block; background: #3b82f6; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;">
                        View My Bookings
                    </a>
                </div>
                
                <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                        Questions? Reply to this email or contact support.<br>
                        © 2024 Talentr. All rights reserved.
                    </p>
                </div>
            </div>
        `
    }),

    vendor_notification: (data: EmailRequest) => ({
        subject: `🔔 New Booking Request - ${data.clientName}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 32px; font-weight: 900; color: #1a1a1a; margin: 0;">Talentr</h1>
                    <p style="color: #666; font-size: 14px;">Event Marketplace</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 10px 0; font-size: 24px;">New Booking Request! 🎊</h2>
                    <p style="margin: 0; opacity: 0.9;">A client wants to book your services</p>
                </div>
                
                <div style="background: #f8fafc; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px;">Request Details</h3>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Client</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${data.clientName}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Event Date</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${data.eventDate}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Event Type</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">${data.eventType}</p>
                    </div>
                    
                    ${data.message ? `
                    <div>
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Client Message</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 14px; background: white; padding: 16px; border-radius: 8px;">${data.message}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="https://event-marketplace-mvp.vercel.app/dashboard" 
                       style="display: inline-block; background: #10b981; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; margin-right: 10px;">
                        Accept Booking
                    </a>
                </div>
                
                <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                        Respond quickly to increase your booking rate!<br>
                        © 2024 Talentr. All rights reserved.
                    </p>
                </div>
            </div>
        `
    }),

    booking_status_update: (data: EmailRequest & { status: string }) => ({
        subject: `📋 Booking ${data.status === 'confirmed' ? 'Confirmed' : 'Updated'} - ${data.vendorName}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 32px; font-weight: 900; color: #1a1a1a; margin: 0;">Talentr</h1>
                    <p style="color: #666; font-size: 14px;">Event Marketplace</p>
                </div>
                
                <div style="background: ${data.status === 'confirmed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}; color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 10px 0; font-size: 24px;">
                        ${data.status === 'confirmed' ? 'Great News! Booking Confirmed! ✅' : 'Booking Status Updated'}
                    </h2>
                    <p style="margin: 0; opacity: 0.9;">${data.vendorName} has responded to your request</p>
                </div>
                
                <div style="background: #f8fafc; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 48px; height: 48px; background: ${data.status === 'confirmed' ? '#10b981' : '#f59e0b'}; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 24px;">${data.status === 'confirmed' ? '✓' : '!'}</span>
                        </div>
                        <div>
                            <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Status</p>
                            <p style="margin: 0; font-size: 20px; font-weight: 700; color: ${data.status === 'confirmed' ? '#10b981' : '#f59e0b'};">
                                ${data.status === 'confirmed' ? 'CONFIRMED' : data.status.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase;">Event</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">${data.eventType} • ${data.eventDate}</p>
                    </div>
                </div>
                
                ${data.status === 'confirmed' ? `
                <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                    <p style="margin: 0; color: #065f46; font-size: 14px;">
                        <strong>Next steps:</strong> The vendor will contact you soon to discuss details. 
                        You can also reach out via WhatsApp from their profile.
                    </p>
                </div>
                ` : ''}
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="https://event-marketplace-mvp.vercel.app/bookings" 
                       style="display: inline-block; background: #3b82f6; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;">
                        View Booking Details
                    </a>
                </div>
                
                <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                        © 2024 Talentr. All rights reserved.
                    </p>
                </div>
            </div>
        `
    })
};

type TemplateType = 'booking_confirmation' | 'vendor_notification' | 'booking_status_update';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { template, ...data } = body as { template: TemplateType } & EmailRequest & { status?: string };

        // Get template
        const emailTemplate = template === 'booking_status_update'
            ? templates.booking_status_update(data as EmailRequest & { status: string })
            : templates[template](data);

        // If Resend is configured, send real email
        if (resend) {
            const { error } = await resend.emails.send({
                from: 'Talentr <noreply@talentr.app>', // Change to your verified domain
                to: data.to,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
            });

            if (error) {
                return NextResponse.json({
                    success: false,
                    error: 'Failed to send email'
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: 'Email sent successfully',
                to: data.to,
                subject: emailTemplate.subject
            });
        }

        // Fallback: Development mode (no RESEND_API_KEY)
        return NextResponse.json({
            success: true,
            message: 'Email queued (dev mode - no RESEND_API_KEY)',
            preview: emailTemplate.subject
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}

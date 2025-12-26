import { NextRequest, NextResponse } from 'next/server';

interface EmailRequest {
    to: string;
    subject: string;
    vendorName: string;
    clientName: string;
    eventDate: string;
    eventType: string;
    message: string;
}

// Email templates
const templates = {
    booking_confirmation: (data: EmailRequest) => ({
        subject: `✅ Booking Confirmed - ${data.vendorName}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
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
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
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
                        <p style="margin: 0 0 4px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                        <p style="margin: 0; color: #1a1a1a; font-size: 14px; background: white; padding: 16px; border-radius: 8px;">${data.message}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="https://event-marketplace-mvp.vercel.app/dashboard" 
                       style="display: inline-block; background: #10b981; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;">
                        View in Dashboard
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

export async function POST(request: NextRequest) {
    try {
        const body: EmailRequest & { template: 'booking_confirmation' | 'vendor_notification' } = await request.json();
        const { template, ...data } = body;

        // For MVP, we'll log the email instead of actually sending
        // In production, integrate with Resend, SendGrid, or similar
        // const emailData = {
        //     template,
        //     to: data.to,
        //     subject: templates[template](data).subject,
        // };

        // Return success for MVP demo
        return NextResponse.json({
            success: true,
            message: 'Email queued successfully',
            preview: templates[template](data).subject
        });

    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}

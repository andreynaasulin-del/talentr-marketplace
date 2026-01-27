import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Enhanced upload API with video support and better error handling
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type - support both images and videos
        const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        const isImage = imageTypes.includes(file.type);
        const isVideo = videoTypes.includes(file.type) || file.name.toLowerCase().endsWith('.mov');

        if (!isImage && !isVideo) {
            return NextResponse.json(
                { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV` },
                { status: 400 }
            );
        }

        // Validate file size
        const maxImageSize = 10 * 1024 * 1024;  // 10MB for images (after client compression)
        const maxVideoSize = 100 * 1024 * 1024; // 100MB for videos
        const maxSize = isVideo ? maxVideoSize : maxImageSize;

        if (file.size > maxSize) {
            const maxMB = maxSize / (1024 * 1024);
            return NextResponse.json(
                { error: `File too large. Maximum: ${maxMB}MB for ${isVideo ? 'videos' : 'images'}` },
                { status: 400 }
            );
        }

        // Create Supabase client with service role
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase credentials');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Generate unique filename with proper folder structure
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 10);
        const extension = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
        const folder = isVideo ? 'videos' : 'photos';
        const fileName = `${folder}/${timestamp}-${randomString}.${extension}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine bucket
        const bucket = 'vendor-photos'; // Single bucket with folder structure

        // Upload to Supabase Storage with retry
        let uploadAttempt = 0;
        let lastError: Error | null = null;

        while (uploadAttempt < 3) {
            try {
                const { data, error } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, buffer, {
                        contentType: file.type === 'video/quicktime' ? 'video/mp4' : file.type,
                        cacheControl: '31536000', // 1 year cache
                        upsert: false
                    });

                if (error) {
                    throw error;
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                return NextResponse.json({
                    success: true,
                    url: urlData.publicUrl,
                    fileName,
                    type: isVideo ? 'video' : 'image',
                    size: file.size,
                    originalName: file.name
                });

            } catch (err) {
                lastError = err as Error;
                uploadAttempt++;

                if (uploadAttempt < 3) {
                    // Wait before retry (exponential backoff)
                    await new Promise(r => setTimeout(r, 1000 * uploadAttempt));
                }
            }
        }

        // All retries failed
        console.error('Upload failed after 3 attempts:', lastError);
        return NextResponse.json(
            { error: 'Upload failed. Please try again.' },
            { status: 500 }
        );

    } catch (error) {
        console.error('Upload error:', error);

        // Provide helpful error message
        let errorMessage = 'Internal server error';
        if (error instanceof Error) {
            if (error.message.includes('size')) {
                errorMessage = 'File too large';
            } else if (error.message.includes('type')) {
                errorMessage = 'Invalid file type';
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

// GET - Health check for upload endpoint
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        limits: {
            maxImageSize: '10MB',
            maxVideoSize: '100MB',
            supportedImages: ['JPEG', 'PNG', 'WebP', 'GIF'],
            supportedVideos: ['MP4', 'WebM', 'MOV']
        }
    });
}

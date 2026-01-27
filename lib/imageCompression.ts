/**
 * Image Compression Utility
 * Client-side image compression and processing before upload
 */

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;      // 0-1
    outputType?: 'image/jpeg' | 'image/webp' | 'image/png';
    maxSizeMB?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    outputType: 'image/webp', // WebP for better compression
    maxSizeMB: 1
};

/**
 * Compress an image file before upload
 * Automatically converts to WebP and resizes if needed
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Skip compression for already small files
    if (file.size < 100 * 1024) { // < 100KB
        return file;
    }

    // Skip if not an image
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // Don't compress GIFs (they lose animation)
    if (file.type === 'image/gif') {
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        img.onload = () => {
            try {
                // Calculate new dimensions
                let { width, height } = img;
                const maxW = opts.maxWidth || 1920;
                const maxH = opts.maxHeight || 1080;

                // Scale down if needed
                if (width > maxW || height > maxH) {
                    const ratio = Math.min(maxW / width, maxH / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                // Draw image with high quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with quality setting
                const outputType = opts.outputType || 'image/webp';
                let quality = opts.quality || 0.85;

                canvas.toBlob(
                    async (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        // If still too large, try reducing quality
                        let finalBlob = blob;
                        const maxBytes = (opts.maxSizeMB || 1) * 1024 * 1024;

                        if (finalBlob.size > maxBytes && quality > 0.3) {
                            // Retry with lower quality
                            quality = Math.max(0.3, quality - 0.2);
                            canvas.toBlob(
                                (lowQBlob) => {
                                    if (lowQBlob && lowQBlob.size < finalBlob!.size) {
                                        finalBlob = lowQBlob;
                                    }
                                    createFile(finalBlob!, outputType);
                                },
                                outputType,
                                quality
                            );
                        } else {
                            createFile(finalBlob, outputType);
                        }

                        function createFile(b: Blob, type: string) {
                            // Generate new filename with correct extension
                            const ext = type === 'image/webp' ? 'webp' :
                                type === 'image/png' ? 'png' : 'jpg';
                            const baseName = file.name.replace(/\.[^/.]+$/, '');
                            const newName = `${baseName}.${ext}`;

                            const compressedFile = new File([b], newName, {
                                type: type,
                                lastModified: Date.now()
                            });

                            console.log(`[Compression] ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB (${Math.round((1 - compressedFile.size / file.size) * 100)}% saved)`);

                            resolve(compressedFile);
                        }
                    },
                    outputType,
                    quality
                );
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image for compression'));
        };

        // Load image from file
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Compress video by reducing resolution (basic implementation)
 * For proper video compression, consider using FFmpeg.wasm
 */
export async function validateVideo(file: File): Promise<{ valid: boolean; error?: string }> {
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];

    if (!file.type.startsWith('video/')) {
        return { valid: false, error: 'Not a video file' };
    }

    if (file.size > MAX_VIDEO_SIZE) {
        return {
            valid: false,
            error: `Video too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 50MB`
        };
    }

    // Check video type (be lenient with MOV files)
    const isAllowedType = ALLOWED_VIDEO_TYPES.some(t => file.type.includes(t.split('/')[1]));
    if (!isAllowedType && !file.name.toLowerCase().endsWith('.mov')) {
        return {
            valid: false,
            error: 'Unsupported video format. Use MP4, WebM, or MOV'
        };
    }

    return { valid: true };
}

/**
 * Get video thumbnail at specific time
 */
export async function getVideoThumbnail(file: File, timeSeconds = 1): Promise<string | null> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.playsInline = true;
        video.muted = true;

        video.onloadeddata = () => {
            video.currentTime = Math.min(timeSeconds, video.duration || 1);
        };

        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(null);
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            URL.revokeObjectURL(video.src);
            resolve(dataUrl);
        };

        video.onerror = () => {
            resolve(null);
        };

        video.src = URL.createObjectURL(file);
    });
}

/**
 * Batch process multiple files
 */
export async function processFilesForUpload(files: File[]): Promise<{
    images: File[];
    videos: File[];
    errors: string[];
}> {
    const images: File[] = [];
    const videos: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            try {
                const compressed = await compressImage(file);
                images.push(compressed);
            } catch (err) {
                errors.push(`Failed to process ${file.name}: ${err}`);
            }
        } else if (file.type.startsWith('video/')) {
            const validation = await validateVideo(file);
            if (validation.valid) {
                videos.push(file);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        } else {
            errors.push(`${file.name}: Unsupported file type`);
        }
    }

    return { images, videos, errors };
}

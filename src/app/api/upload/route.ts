import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const instituteName = formData.get('instituteName') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate File Type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Compress and Process using Sharp (In-Memory)
        // Resize to max 1200px width, convert to WebP, quality 80
        const processedImageBuffer = await sharp(buffer)
            .resize(1200, null, { // Width 1200, height auto
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();

        const timestamp = Date.now();
        const safeName = instituteName ? instituteName.replace(/[^a-zA-Z0-9]/g, '_') : 'unknown';
        const filename = `receipts/${safeName}_Receipt_${timestamp}.webp`;

        // Upload to Vercel Blob
        const blob = await put(filename, processedImageBuffer, {
            access: 'public',
            contentType: 'image/webp'
        });

        return NextResponse.json({
            success: true,
            url: blob.url
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: 'Failed to upload receipt', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

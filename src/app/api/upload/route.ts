import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
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

        // Directory setup
        const uploadDir = path.join(process.cwd(), 'public/uploads/receipts');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const safeName = instituteName ? instituteName.replace(/[^a-zA-Z0-9]/g, '_') : 'unknown';
        const filename = `${safeName}_Receipt_${timestamp}.webp`;
        const filepath = path.join(uploadDir, filename);

        // Compress and Save using Sharp
        // Resize to max 1200px width, convert to WebP, quality 80
        await sharp(buffer)
            .resize(1200, null, { // Width 1200, height auto
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(filepath);

        const fileUrl = `/uploads/receipts/${filename}`;

        return NextResponse.json({
            success: true,
            url: fileUrl
        });

    } catch (error) {
        console.error('Local Upload Error:', error);
        return NextResponse.json(
            { error: 'Failed to upload receipt', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

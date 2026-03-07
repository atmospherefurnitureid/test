import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
    try {
        console.log("Server: Received upload request");

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const productCode = formData.get('productCode') as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`Server: Processing file ${file.name}, productCode: ${productCode || 'N/A'}`);

        // Limit local upload size to 4MB
        if (file.size > 4 * 1024 * 1024) {
            return NextResponse.json({ error: "Ukuran file maksimal 4MB." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine upload directory
        let uploadSubDir = 'general';
        if (productCode) {
            const materialPrefix = productCode.split('-')[0]; // W, I, or WI
            uploadSubDir = join('products', materialPrefix, productCode);
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads', uploadSubDir);

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            console.error("Error creating directory:", err);
        }

        // Generate a unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filename = `${timestamp}_${safeName}`;
        const path = join(uploadDir, filename);

        // Write the file to disk
        await writeFile(path, buffer);
        console.log(`Server: File saved to ${path}`);

        // Return the public URL
        const publicUrl = `/uploads/${uploadSubDir.replace(/\\/g, '/')}/${filename}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error("Critical upload error:", error);
        return NextResponse.json({ error: "Internal Server Error: Gagal menyimpan file." }, { status: 500 });
    }
}

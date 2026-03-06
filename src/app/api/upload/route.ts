import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
    try {
        console.log("Server: Received local upload request");

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`Server: Processing file ${file.name}, size: ${file.size}, type: ${file.type}`);

        // Limit local upload size to 4MB as per user request
        if (file.size > 4 * 1024 * 1024) {
            return NextResponse.json({ error: "Ukuran file maksimal 4MB." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define local upload path
        const uploadDir = join(process.cwd(), 'public', 'uploads');

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
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error("Critical Local upload error:", error);
        return NextResponse.json({ error: "Internal Server Error: Gagal menyimpan file secara lokal." }, { status: 500 });
    }
}

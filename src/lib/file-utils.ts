import { unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Deletes a file from the public/uploads directory given its public URL.
 * Only handles files that have /uploads/ in their URL.
 * @param url The public URL of the file (e.g., /uploads/123456_image.jpg)
 */
export async function deleteUploadedFile(url: string) {
    if (!url || !url.startsWith('/uploads/')) {
        return;
    }

    try {
        const filename = url.replace('/uploads/', '');
        const filePath = join(process.cwd(), 'public', 'uploads', filename);

        await unlink(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.warn(`File not found, skipping deletion: ${url}`);
        } else {
            console.error(`Error deleting file ${url}:`, error);
        }
    }
}

/**
 * Deletes multiple files given an array of public URLs.
 */
export async function deleteUploadedFiles(urls: string[]) {
    if (!urls || !Array.isArray(urls)) return;

    await Promise.all(urls.map(url => deleteUploadedFile(url)));
}

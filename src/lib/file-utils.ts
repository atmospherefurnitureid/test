import { unlink, rm } from 'fs/promises';
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
        // Remove leading /uploads/ to get relative path within uploads dir
        const relativePath = url.replace('/uploads/', '');
        const filePath = join(process.cwd(), 'public', 'uploads', ...relativePath.split('/'));

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

/**
 * Deletes an entire product's media folder.
 */
export async function deleteProductFolder(productCode: string) {
    if (!productCode) return;

    try {
        const materialPrefix = productCode.split('-')[0];
        const folderPath = join(process.cwd(), 'public', 'uploads', 'products', materialPrefix, productCode);

        await rm(folderPath, { recursive: true, force: true });
        console.log(`Successfully deleted product folder: ${folderPath}`);
    } catch (error: any) {
        console.error(`Error deleting product folder for ${productCode}:`, error);
    }
}

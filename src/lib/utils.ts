export function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};
export const CATEGORY_MAP: Record<string, string> = {
    "meja": "11",
    "kursi": "21",
    "bangku": "22",
    "bench": "22",
    "stool": "23",
    "lemari": "31",
    "rak": "32",
    "kabinet": "33",
    "credenza": "34",
    "nakas": "35",
    "bed frame": "41",
    "sofa": "51",
    "konsol": "12",
};

export function generateSKU(label: string, category: string, existingCodes: string[]): string {
    let prefix = "W-";
    if (label === "Besi") prefix = "I-";
    if (label === "Mixed") prefix = "WI-";

    let catCode = "99";
    const catLower = category.toLowerCase();
    for (const [key, code] of Object.entries(CATEGORY_MAP)) {
        if (catLower.includes(key)) {
            catCode = code;
            break;
        }
    }

    const matchPattern = `${prefix}${catCode}`;
    const sequences = existingCodes
        .filter(c => c.startsWith(matchPattern))
        .map(c => {
            const seqPart = c.replace(matchPattern, "");
            return parseInt(seqPart, 10) || 0;
        });

    const maxSeq = sequences.length > 0 ? Math.max(...sequences) : 0;
    return `${matchPattern}${String(maxSeq + 1).padStart(4, "0")}`;
}


export interface ProcessedIcon {
    url: string; // The URL to the processed image (or the original if no processing done)
    type: 'svg' | 'raster';
}

/**
 * Regex to find {{tech}} placeholders in bio text.
 * Matches: {{Python}}, {{React.js}}, etc.
 */
export const extractTechFromBio = (bio: string): string[] => {
    const regex = /\{\{([\w\s\.-]+)\}\}/g;
    const matches = [...bio.matchAll(regex)];
    return matches.map(match => match[1].trim());
};

/**
 * Downloads and processes an icon from a URL.
 * In this implementation, it verifies the URL is reachable and returns it.
 * Real resizing would require 'sharp' or similar.
 */
export async function downloadAndProcessIcon(url: string): Promise<ProcessedIcon | null> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
            // Try GET if HEAD fails (some servers block HEAD)
            const getResponse = await fetch(url);
            if (!getResponse.ok) return null;
        }

        const contentType = response.headers.get('content-type');
        const isSvg = contentType?.includes('svg') || url.endsWith('.svg');

        return {
            url: url,
            type: isSvg ? 'svg' : 'raster'
        };
    } catch (error) {
        console.error("Failed to process icon:", error);
        return null;
    }
}

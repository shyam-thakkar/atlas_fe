"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../../../lib/api";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DynamicSocialIconProps {
    platform: string; // e.g., "github", "linkedin"
    url: string;
    className?: string;
}

interface SocialApiResponse {
    display_name: string;
    code_name: string;
    icon_path: string | null;
    color_variant: 'colored' | 'black' | 'white';
}

export function DynamicSocialIcon({ platform, url, className = "" }: DynamicSocialIconProps) {
    const [data, setData] = useState<SocialApiResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchSocial = async () => {
            try {
                const result = await apiRequest<SocialApiResponse>(`/api/profile/social/search/?q=${encodeURIComponent(platform)}`);

                if (isMounted && result) {
                    setData(result);
                }
            } catch (error: any) {
                if (error?.status === 404 || error?.error) {
                    console.warn(`Social platform '${platform}' not found in database`);
                } else {
                    console.error(`Failed to fetch social icon for ${platform}`, error);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSocial();

        return () => {
            isMounted = false;
        };
    }, [platform]);

    if (loading) {
        return (
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        );
    }

    if (!data || !data.icon_path) {
        // Fallback: show generic icon
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-center p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 hover:border-zinc-300 dark:hover:border-zinc-600 ${className}`}
                title={platform}
            >
                <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </a>
        );
    }

    // Construct full image URL
    let imageUrl = data.icon_path;
    if (imageUrl.startsWith('http://localhost') || imageUrl.startsWith('http://127.0.0.1')) {
        try {
            const urlObj = new URL(imageUrl);
            imageUrl = `${BASE_API_URL}${urlObj.pathname}`;
        } catch (e) {
            imageUrl = `${BASE_API_URL}${data.icon_path}`;
        }
    } else if (!imageUrl.startsWith('http')) {
        imageUrl = `${BASE_API_URL}${data.icon_path}`;
    }

    // Determine if we should invert based on color_variant
    const shouldInvertInDark = data.color_variant === 'black';
    const shouldInvertInLight = data.color_variant === 'white';

    return (
        <a
            href={url}
            target={url.startsWith("mailto:") ? undefined : "_blank"}
            rel={url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className={`group relative flex items-center justify-center p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 hover:border-zinc-300 dark:hover:border-zinc-600 ${className}`}
            title={data.display_name}
        >
            <img
                src={imageUrl}
                alt={data.display_name}
                className={`w-5 h-5 object-contain ${shouldInvertInDark ? 'dark:invert' : ''} ${shouldInvertInLight ? 'invert dark:invert-0' : ''}`}
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
            />
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                {data.display_name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
            </span>
        </a>
    );
}

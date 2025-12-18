"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../../../lib/api";

const BASE_API_URL = 'https://qgwkmvmz-8000.inc1.devtunnels.ms';

interface TechStackIconProps {
  codeName: string;
}

interface TechApiResponse {
  display_name: string;
  code_name: string;
  icon_path: string;
  doc_url: string;
  color_variant: 'colored' | 'black' | 'white';
}

export function TechStackIcon({ codeName }: TechStackIconProps) {
  const [data, setData] = useState<TechApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTech = async () => {
      try {
        const result = await apiRequest<TechApiResponse>(`/api/profile/tech/search/?q=${encodeURIComponent(codeName)}`);

        if (isMounted && result) {
          setData(result);
        }
      } catch (error: any) {
        if (error?.status === 404 || error?.error) {
          console.warn(`Technology '${codeName}' not found in database`);
        } else {
          console.error(`Failed to fetch tech icon for ${codeName}`, error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTech();

    return () => {
      isMounted = false;
    };
  }, [codeName]);

  if (loading) {
    return (
      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
    );
  }

  if (!data) {
    // Fallback: show text badge if not found
    return (
      <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {codeName}
      </div>
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

  // Determine if we should invert in dark mode
  const shouldInvertInDark = data.color_variant === 'black';
  const shouldInvertInLight = data.color_variant === 'white';

  return (
    <a
      href={data.doc_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center transition-all hover:scale-125"
      title={data.display_name}
    >
      <img
        src={imageUrl}
        alt={data.display_name}
        className={`w-10 h-10 object-contain opacity-80 hover:opacity-100 transition-opacity ${shouldInvertInDark ? 'dark:invert' : ''} ${shouldInvertInLight ? 'invert dark:invert-0' : ''}`}
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {data.display_name}
      </div>
    </a>
  );
}

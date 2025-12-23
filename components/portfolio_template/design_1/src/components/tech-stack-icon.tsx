"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../../../lib/api";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TechStackIconProps {
  codeName: string;
  clickable?: boolean; // When false, unregistered techs show as plain text (for project cards)
}

interface TechApiResponse {
  display_name: string;
  code_name: string;
  icon_path: string | null;
  doc_url: string;
  color_variant: 'colored' | 'black' | 'white';
}

export function TechStackIcon({ codeName, clickable = true }: TechStackIconProps) {
  const [data, setData] = useState<TechApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTech = async () => {
      try {
        const result = await apiRequest<TechApiResponse>(`/api/profile/tech/search/?q=${encodeURIComponent(codeName)}`);

        if (isMounted && result) {
          setData(result);
          setNotFound(false);
        }
      } catch (error: any) {
        if (error?.status === 404 || error?.error) {
          console.warn(`Technology '${codeName}' not found in database`);
          if (isMounted) setNotFound(true);
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
    );
  }

  if (notFound || (data && !data.icon_path)) {
    const isMissingIcon = !!(data && !data.icon_path);
    const displayName = data?.display_name || codeName;

    // Non-clickable version for project cards - same style but as span
    if (!clickable) {
      return (
        <span
          className="group relative flex items-center justify-center w-auto h-10 px-3 gap-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50"
          title={isMissingIcon ? `${displayName} (Icon Missing)` : `${displayName} (Not Found)`}
        >
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-400 whitespace-nowrap">
            {displayName}
          </span>
        </span>
      );
    }

    return (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="group relative flex items-center justify-center w-auto h-10 px-3 gap-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all hover:scale-105"
          title={isMissingIcon ? `${displayName} (Icon Missing)` : `${displayName} (Not Found)`}
        >
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-400 whitespace-nowrap">
            {displayName}
          </span>
          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {displayName} {isMissingIcon ? "(Icon Missing)" : "(Not Found)"}
          </div>
        </button>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {isMissingIcon ? "Icon Not Found" : "Tech Stack Not Found"}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {isMissingIcon
                      ? `The icon for "${displayName}" is missing.`
                      : `"${displayName}" is not in our database`}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    {isMissingIcon
                      ? "This technology icon is not available. You can add a custom badge through the Portfolio Editor."
                      : "This technology stack is not available in our database. You can add a custom badge through the Portfolio Editor."}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    To add a custom tech stack:
                  </p>
                  <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-decimal list-inside">
                    <li>Go to Portfolio Editor</li>
                    <li>Navigate to the Tech Stack section</li>
                    <li>Click "Add Custom Tech Stack"</li>
                    <li>Fill in the details for "{displayName}"</li>
                  </ol>
                </div>

                <div className="flex gap-2 pt-2">
                  <a
                    href="/dashboard/editor"
                    className="flex-1 py-2 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center"
                  >
                    Go to Editor
                  </a>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-2 px-4 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // At this point, data must exist and icon_path must be a string.
  // We can assert this with non-null assertion operators.
  let imageUrl = data!.icon_path!;
  if (imageUrl.startsWith('http://localhost') || imageUrl.startsWith('http://127.0.0.1')) {
    try {
      const urlObj = new URL(imageUrl);
      imageUrl = `${BASE_API_URL}${urlObj.pathname}`;
    } catch (e) {
      imageUrl = `${BASE_API_URL}${data!.icon_path!}`;
    }
  } else if (!imageUrl.startsWith('http')) {
    imageUrl = `${BASE_API_URL}${data!.icon_path!}`;
  }

  // Determine filter class based on color variant
  const getFilterClass = () => {
    switch (data!.color_variant) {
      case 'black':
        // Icon is Black.
        // Light Mode (White Bg): No invert (Keep Black)
        // Dark Mode (Black Bg): Invert (Make White)
        return 'dark:invert';
      case 'white':
        // Icon is White.
        // Light Mode (White Bg): Invert (Make Black)
        // Dark Mode (Black Bg): No invert (Keep White)
        return 'invert dark:invert-0';
      default:
        // Colored or unknown - no filters
        return '';
    }
  };

  return (
    <a
      href={data!.doc_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center transition-all hover:scale-125"
      title={data!.display_name}
    >
      <img
        src={imageUrl}
        alt={data!.display_name}
        className={`w-10 h-10 object-contain opacity-80 hover:opacity-100 transition-opacity ${getFilterClass()}`}
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {data!.display_name}
      </div>
    </a>
  );
}

"use client";

import { useEffect, useState } from "react";
import { TechBadge } from "./tech-badge";
import { apiRequest } from "../../../../../lib/api";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SmartTechBadgeProps {
  codeName: string;
}

interface TechApiResponse {
  display_name: string;
  code_name: string;
  icon_path: string | null;
  doc_url: string;
  color_variant: 'colored' | 'black' | 'white';
}

export function SmartTechBadge({ codeName }: SmartTechBadgeProps) {
  const [data, setData] = useState<TechApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTech = async () => {
      try {
        // Use exact match API - returns single object or 404
        // encodeURIComponent handles special chars like + in c++
        const result = await apiRequest<TechApiResponse>(`/api/profile/tech/search/?q=${encodeURIComponent(codeName)}`);
        
        if (isMounted && result) {
           setData(result);
           setNotFound(false);
        }
      } catch (error: any) {
        // API returns 404 with error message if not found
        if (error?.status === 404 || error?.error) {
          console.warn(`Technology '${codeName}' not found in database`);
          if (isMounted) setNotFound(true);
        } else {
          console.error(`Failed to fetch tech badge for ${codeName}`, error);
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

  const handleAddCustomTech = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-gray-400 text-xs animate-pulse">loading...</span>;
  }

  if (notFound || (data && !data.icon_path)) {
    const isMissingIcon = !!(data && !data.icon_path);
    const displayName = data?.display_name || codeName;

    return (
      <>
        <button
          onClick={handleAddCustomTech}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
          title={isMissingIcon ? "Icon not found - Click to add custom badge" : "Tech not found - Click to add custom badge"}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {displayName}
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
                    {isMissingIcon ? "Tech Badge Icon Missing" : "Tech Badge Not Found"}
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
                      ? "You can add a custom badge for this technology through the Portfolio Editor."
                      : "This technology badge is not available in our database. You can add a custom badge through the Portfolio Editor."}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    To add a custom tech badge:
                  </p>
                  <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-decimal list-inside">
                    <li>Go to Portfolio Editor</li>
                    <li>Navigate to the Bio & About section</li>
                    <li>Click "Add Custom Tech Badge"</li>
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

  if (!data) {
    // Fallback: render text only if fetch failed for other reasons
    return <span className="font-semibold text-indigo-600 dark:text-indigo-400">{codeName}</span>;
  }

  // Construct full image URL if relative or pointing to localhost (fix for dev tunnels)
  // At this point we know data exists and icon_path is valid
  let imageUrl = data!.icon_path!;
  if (imageUrl.startsWith('http://localhost') || imageUrl.startsWith('http://127.0.0.1')) {
      // Strip domain to make it relative to the API base we want to use
      try {
          const urlObj = new URL(imageUrl);
          imageUrl = `${BASE_API_URL}${urlObj.pathname}`;
      } catch (e) {
          // Fallback if URL parsing fails
          imageUrl = `${BASE_API_URL}${data!.icon_path!}`; 
      }
  } else if (!imageUrl.startsWith('http')) {
      imageUrl = `${BASE_API_URL}${data!.icon_path!}`;
  }

  return (
    <TechBadge 
      name={data!.display_name}
      href={data!.doc_url}
      imageSrc={imageUrl}
      variant={data!.color_variant}
    />
  );
}

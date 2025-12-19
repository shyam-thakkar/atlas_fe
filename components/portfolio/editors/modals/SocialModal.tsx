"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, X, Globe } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface SocialData {
    display_name: string;
    code_name: string;
    icon_path: string;
    color_variant: 'colored' | 'black' | 'white';
}

interface SocialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (social: SocialData) => void;
}

export function SocialModal({ isOpen, onClose, onSelect }: SocialModalProps) {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SocialData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const fetchSocials = async (reset: boolean = false) => {
        if (reset) {
            setPage(1);
            setSearchResults([]);
            setHasMore(true);
            setNextPageUrl(null);
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const baseUrl = `/api/profile/social/list/`;
            const params = new URLSearchParams({
                page_size: '20',
            });

            if (reset) {
                params.set('page', '1');
            } else if (nextPageUrl) {
                params.set('page', (page + 1).toString());
            }

            if (searchQuery) {
                params.set('q', searchQuery);
            }

            const endpoint = `${baseUrl}?${params.toString()}`;
            const response = await apiRequest<any>(endpoint);

            let newResults: any[] = [];
            let next: string | null = null;

            if (response && response.results) {
                newResults = response.results;
                next = response.next;
            } else if (Array.isArray(response)) {
                newResults = response;
                next = null;
            }

            const mappedResults: SocialData[] = newResults.map((item: any) => ({
                display_name: item.display_name || item.name || "Unknown",
                code_name: item.code_name || "",
                icon_path: item.icon_source_url || item.icon_path || "",
                color_variant: item.color_variant || "colored"
            }));

            if (reset) {
                setSearchResults(mappedResults);
                setPage(1);
            } else {
                setSearchResults(prev => [...prev, ...mappedResults]);
                setPage(prev => prev + 1);
            }

            setHasMore(!!next);
            setNextPageUrl(next);

        } catch (error) {
            console.error("Fetch failed", error);
            if (reset) setSearchResults([]);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSocials(true);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            if (!isLoadingMore && hasMore && !isLoading) {
                fetchSocials(false);
            }
        }
    };

    if (!isOpen || !mounted) return null;

    const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

    return createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Select Social Platform
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search platforms (e.g. GitHub, LinkedIn)..."
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all text-zinc-900 dark:text-zinc-100"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto p-4 min-h-[300px]" onScroll={handleScroll}>
                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {searchResults.map((social, idx) => {
                                let imageUrl = social.icon_path;
                                if (imageUrl && !imageUrl.startsWith('http')) {
                                    imageUrl = `${BASE_API_URL}${imageUrl}`;
                                }

                                const shouldInvertInDark = social.color_variant === 'black';
                                const shouldInvertInLight = social.color_variant === 'white';

                                return (
                                    <button
                                        key={`${social.code_name}-${idx}`}
                                        onClick={() => {
                                            onSelect(social);
                                            onClose();
                                        }}
                                        className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group"
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded p-1 group-hover:scale-110 transition-transform">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt="" 
                                                    className={`w-full h-full object-contain ${shouldInvertInDark ? 'dark:invert' : ''} ${shouldInvertInLight ? 'invert dark:invert-0' : ''}`}
                                                />
                                            ) : (
                                                <Globe className="w-4 h-4 text-zinc-400" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                            {social.display_name}
                                        </span>
                                    </button>
                                );
                            })}
                            {isLoadingMore && (
                                <div className="col-span-full py-4 flex justify-center text-zinc-400 text-sm">
                                    Loading more...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                <Search className="w-6 h-6 text-zinc-400" />
                            </div>
                            <h3 className="text-zinc-900 dark:text-zinc-100 font-medium mb-1">
                                {searchQuery ? "No results found" : "Start searching"}
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                                {searchQuery ? `Couldn't find "${searchQuery}"` : "Find social platforms to add."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

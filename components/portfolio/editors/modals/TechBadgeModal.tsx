"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, X, Globe, Code } from "lucide-react";
import { DESCRIPTION_TECH_BADGES, TechBadgeData } from "@/components/portfolio_template/design_1/src/constants/tech-badges";
import { AutoResizeTextarea } from "@/components/ui/AutoResizeTextarea";
import { apiRequest } from "@/lib/api";

interface TechBadgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (badge: TechBadgeData) => void;
}

export function TechBadgeModal({ isOpen, onClose, onSelect }: TechBadgeModalProps) {
    const [mounted, setMounted] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // ... State declarations
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TechBadgeData[]>([]);
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Custom Badge State
    const [customName, setCustomName] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [customIcon, setCustomIcon] = useState("");
    const [customUrl, setCustomUrl] = useState("");
    const [customVariant, setCustomVariant] = useState<"colored" | "black" | "white">("colored");

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            resetForm();
            // Fetch initial data immediately when opening
            fetchTechs(true);
        } else {
            // Optional: delayed unmount for animation
            // setTimeout(() => setMounted(false), 200); 
            // For now simple unmount
            setMounted(false);
        }
    }, [isOpen]);

    // Unified Fetch for List & Search
    const fetchTechs = useCallback(async (reset: boolean = false) => {
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
            const baseUrl = `/api/profile/tech/list/`;
            const params = new URLSearchParams({
                page_size: '20', // Increased to ensure scrollbar appears on larger screens
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

            // Handle pagination response format { count, next, results }
            if (response && response.results) {
                newResults = response.results;
                next = response.next;
            } else if (Array.isArray(response)) {
                // Fallback for non-paginated arrays
                newResults = response;
                next = null;
            }

            const mappedResults: TechBadgeData[] = newResults.map((item: any) => ({
                name: item.display_name || item.name || "Unknown",
                code_name: item.code_name || item.name?.toLowerCase().replace(/\s+/g, '-') || "unknown",
                href: item.doc_url || item.href || "#",
                imageSrc: item.icon_path || item.imageSrc || "",
                variant: item.color_variant || item.variant || "colored"
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
    }, [page, nextPageUrl, searchQuery]);

    // Refetch when search query changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTechs(true);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Check if we need to load more data to fill the screen (Auto-fill)
    useEffect(() => {
        if (!isLoading && !isLoadingMore && hasMore && scrollContainerRef.current) {
            const { scrollHeight, clientHeight } = scrollContainerRef.current;
            // If content is smaller than container effectively, trigger load
            if (scrollHeight <= clientHeight + 50) {
                // Need to be careful not to loop. state update in fetchTechs handles it?
                // The hasMore check protects end. 
                // The isLoading check protects parallel.
                // It should be fine.
                fetchTechs(false);
            }
        }
    }, [searchResults, hasMore, isLoading, isLoadingMore, fetchTechs]);

    // Infinite Scroll Handler
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) { // 50px threshold
            if (!isLoadingMore && hasMore && !isLoading) {
                fetchTechs(false);
            }
        }
    };

    const handleCustomNameChange = (name: string) => {
        setCustomName(name);
        // Auto-generate code name (simple slugify)
        setCustomCode(`{{${name.replace(/\s+/g, '')}}}`);
    };

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Call external Django API with correct field names
            const newBadge = await apiRequest<any>('/api/profile/tech/', {
                method: 'POST',
                body: {
                    display_name: customName,
                    doc_url: customUrl || '#',
                    icon_source_url: customIcon || '',
                    color_variant: customVariant,
                }
            });

            // Map response back to TechBadgeData format
            const mappedBadge: TechBadgeData = {
                name: newBadge.display_name || customName,
                code_name: newBadge.code_name || customCode,
                href: newBadge.doc_url || customUrl || '#',
                imageSrc: newBadge.icon_source_url || newBadge.icon_path || customIcon || '',
                variant: newBadge.color_variant || customVariant
            };

            onSelect(mappedBadge);
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error creating badge:', error);
            alert('Failed to create tech badge. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setCustomName("");
        setCustomCode("");
        setCustomIcon("");
        setCustomUrl("");
        setIsCustomMode(false);
        setSearchQuery("");
        setSearchResults([]); // Clear search results on form reset
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-zinc-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                    <h2 className="text-lg font-bold text-zinc-900">
                        {isCustomMode ? "Add Custom Tech Badge" : "Select Technology"}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-zinc-100 transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {!isCustomMode ? (
                    /* Search & Select Mode */
                    <>
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Search technologies (e.g. Python, React)..."
                                        className="w-full pl-9 pr-10 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black transition-all text-zinc-900"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                    {isLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsCustomMode(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Custom
                                </button>
                            </div>
                        </div>

                        <div ref={scrollContainerRef} className="overflow-y-auto p-4 h-[350px]" onScroll={handleScroll}>
                            {/* RESULTS LIST */}
                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {searchResults.map((badge, idx) => (
                                        <button
                                            key={`${badge.name}-${idx}`}
                                            onClick={() => {
                                                onSelect(badge);
                                                onClose();
                                            }}
                                            className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 rounded p-1 group-hover:scale-110 transition-transform">
                                                {badge.imageSrc ? (
                                                    <img
                                                        src={badge.imageSrc}
                                                        alt=""
                                                        className={`w-full h-full object-contain ${badge.variant === 'black' ? 'dark:invert' :
                                                            badge.variant === 'white' ? ' invert dark:invert-0' : ''
                                                            }`}
                                                    />
                                                ) : (
                                                    <Code className="w-4 h-4 text-zinc-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-zinc-700 truncate">
                                                {badge.name}
                                            </span>
                                        </button>
                                    ))}
                                    {isLoadingMore && (
                                        <div className="col-span-full py-4 flex justify-center text-zinc-400 text-sm">
                                            Loading more...
                                        </div>
                                    )}
                                </div>
                            ) : isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin mb-4"></div>
                                    <p className="text-zinc-500 text-sm">Loading technologies...</p>
                                </div>
                            ) : (
                                /* EMPTY STATE */
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                                        <Search className="w-6 h-6 text-zinc-400" />
                                    </div>
                                    <h3 className="text-zinc-900 font-medium mb-1">
                                        {searchQuery ? "No results found" : "Start searching"}
                                    </h3>
                                    <p className="text-zinc-500 text-sm mb-4">
                                        {searchQuery ? `Couldn't find "${searchQuery}"` : "Find technologies to add to your bio."}
                                    </p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setIsCustomMode(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add "{searchQuery}"
                                        </button>
                                    )}
                                </div>
                            )}

                            {(searchQuery === "" && searchResults.length === 0) && ( // Also show custom add button when empty/start
                                <div className="mt-6 pt-4 border-t border-zinc-100">
                                    <button
                                        onClick={() => setIsCustomMode(true)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-300 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Custom Technology
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Custom Badge Form Mode */
                    <form onSubmit={handleCustomSubmit} className="flex-1 flex flex-col">
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                                    Tech Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={customName}
                                    onChange={e => handleCustomNameChange(e.target.value)}
                                    placeholder="e.g. Next.js"
                                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black transition-all text-zinc-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                                        Code Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={customCode}
                                            readOnly
                                            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-500 font-mono"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                                        Icon URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={customIcon}
                                            onChange={e => setCustomIcon(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full pl-9 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black transition-all text-zinc-900"
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                            {customIcon ? (
                                                <img
                                                    src={customIcon}
                                                    alt=""
                                                    className={`w-4 h-4 object-contain ${customVariant === 'black' ? 'dark:invert' :
                                                        customVariant === 'white' ? 'invert dark:invert-0' : ''
                                                        }`}
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            ) : (
                                                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                                    Documentation URL
                                </label>
                                <input
                                    type="url"
                                    value={customUrl}
                                    onChange={e => setCustomUrl(e.target.value)}
                                    placeholder="https://docs.example.com"
                                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black transition-all text-zinc-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                    Color Variant
                                </label>
                                <div className="flex gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${customVariant === 'colored' ? 'border-indigo-600 bg-indigo-600' : 'border-zinc-300'}`}>
                                            {customVariant === 'colored' && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <input type="radio" className="hidden" name="variant" value="colored" checked={customVariant === 'colored'} onChange={() => setCustomVariant('colored')} />
                                        <span className={`text-sm ${customVariant === 'colored' ? 'font-medium text-zinc-900' : 'text-zinc-600'}`}>Colored</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${customVariant === 'black' ? 'border-black bg-black' : 'border-zinc-300'}`}>
                                            {customVariant === 'black' && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <input type="radio" className="hidden" name="variant" value="black" checked={customVariant === 'black'} onChange={() => setCustomVariant('black')} />
                                        <span className={`text-sm ${customVariant === 'black' ? 'font-medium text-zinc-900' : 'text-zinc-600'}`}>Black</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${customVariant === 'white' ? 'border-zinc-400 bg-zinc-200' : 'border-zinc-300'}`}>
                                            {customVariant === 'white' && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                        <input type="radio" className="hidden" name="variant" value="white" checked={customVariant === 'white'} onChange={() => setCustomVariant('white')} />
                                        <span className={`text-sm ${customVariant === 'white' ? 'font-medium text-zinc-900' : 'text-zinc-600'}`}>White</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsCustomMode(false)}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading} // Disable button when loading
                                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50" // Added disabled styles
                            >
                                {isLoading ? "Adding..." : "Add Tech Badge"} {/* Change text based on loading state */}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}

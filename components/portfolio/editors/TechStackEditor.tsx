import React, { useState } from 'react';
import { TechBadgeModal } from './modals/TechBadgeModal';
import { TechBadgeData } from '@/types/tech-badge';
import { apiRequest } from '@/lib/api';

interface TechStackEditorProps {
    data: string[] | null;
    onChange: (data: string[]) => void;
}

export function TechStackEditor({ data, onChange }: TechStackEditorProps) {
    const stack = data || [];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTech = async (badge: TechBadgeData) => {
        try {
            // Use code_name from badge if available, otherwise search API or fallback
            // Type-checking: Ensure codeName is string, even if badge.code_name is undefined
            let codeName = badge.code_name;

            if (!codeName) {
                const response = await apiRequest<any>(`/api/profile/tech/search/?q=${encodeURIComponent(badge.name)}`);
                codeName = response?.code_name || badge.name.toLowerCase().replace(/\s+/g, '-');
            }

            // Ensure codeName is string just in case
            if (codeName && !stack.includes(codeName)) {
                onChange([...stack, codeName]);
            }
        } catch (error) {
            console.error('Failed to add tech:', error);
            // Fallback: use normalized name as code_name
            const codeName = badge.name.toLowerCase().replace(/\s+/g, '-');
            if (!stack.includes(codeName)) {
                onChange([...stack, codeName]);
            }
        }
    };

    const handleRemoveTech = (codeName: string) => {
        onChange(stack.filter(t => t !== codeName));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Tech Stack</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Add technologies from our registry or create custom ones
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Technology
                </button>
            </div>

            {/* Tech Stack Grid */}
            {stack.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-1 gap-y-2">
                    {stack.map((tech, i) => (
                        <TechStackItem
                            key={i}
                            codeName={tech}
                            onRemove={() => handleRemoveTech(tech)}
                        />
                    ))}
                </div>
            ) : (
                <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No technologies added</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Click "Add Technology" to get started
                    </p>
                </div>
            )}

            {/* Modal */}
            <TechBadgeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleAddTech}
            />
        </div>
    );
}

// Individual tech stack item component
interface TechStackItemProps {
    codeName: string;
    onRemove: () => void;
}

function TechStackItem({ codeName, onRemove }: TechStackItemProps) {
    const [techData, setTechData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    React.useEffect(() => {
        const fetchTech = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/tech/search/?q=${encodeURIComponent(codeName)}`);
                if (response.ok) {
                    const data = await response.json();
                    setTechData(data);
                    setNotFound(false);
                } else {
                    if (response.status === 404) {
                        setNotFound(true);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch tech:', error);
                // Assume not found if error matches typical 404 behavior or just general failure
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchTech();
    }, [codeName]);

    if (loading) {
        return (
            <div className="relative group bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 animate-pulse">
                <div className="w-7 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-md mx-auto"></div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="relative group bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                {/* Remove button */}
                <button
                    onClick={onRemove}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
                    title="Remove"
                >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Tech icon (orange/warning) */}
                <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 flex items-center justify-center text-amber-500 dark:text-amber-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 text-center leading-tight truncate w-full px-1">
                        {codeName}
                    </span>
                </div>
            </div>
        );
    }

    const iconUrl = techData?.icon_path
        ? (techData.icon_path.startsWith('http')
            ? techData.icon_path
            : `${process.env.NEXT_PUBLIC_API_URL}${techData.icon_path}`)
        : null;

    // Determine if we should invert based on color_variant
    const shouldInvertInDark = techData?.color_variant === 'black';
    const shouldInvertInLight = techData?.color_variant === 'white';

    return (
        <div className="relative group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
            {/* Remove button */}
            <button
                onClick={onRemove}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
                title="Remove"
            >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Tech icon */}
            <div className="flex flex-col items-center gap-1">
                {iconUrl ? (
                    <img
                        src={iconUrl}
                        alt={techData.display_name}
                        className={`w-7 h-7 object-contain ${shouldInvertInDark ? 'dark:invert' : ''} ${shouldInvertInLight ? 'invert dark:invert-0' : ''}`}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                <div className={`w-7 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-md flex items-center justify-center ${iconUrl ? 'hidden' : ''}`}>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        {codeName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 text-center leading-tight">
                    {techData?.display_name || codeName}
                </span>
            </div>
        </div>
    );
}

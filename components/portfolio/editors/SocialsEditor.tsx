import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { SocialLinks } from '@/types/portfolio';
import { SocialModal } from './modals/SocialModal';
import { apiRequest } from '@/lib/api';

interface SocialsEditorProps {
    data: SocialLinks | null;
    onChange: (data: SocialLinks) => void;
}

interface SocialItem {
    code_name: string;
    display_name: string;
    url: string;
    icon_path: string;
    color_variant: 'colored' | 'black' | 'white';
}

export function SocialsEditor({ data, onChange }: SocialsEditorProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [selectedSocial, setSelectedSocial] = useState<any>(null);
    const [urlInput, setUrlInput] = useState('');
    const [urlError, setUrlError] = useState('');
    const [socialItems, setSocialItems] = useState<SocialItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load existing socials on mount
    React.useEffect(() => {
        const loadSocials = async () => {
            if (!data) {
                setLoading(false);
                return;
            }

            const items: SocialItem[] = [];

            // Map through the SocialLinks object
            for (const [key, url] of Object.entries(data)) {
                if (url && typeof url === 'string') {
                    try {
                        // Fetch social data from API
                        const result = await apiRequest<any>(`/api/profile/social/search/?q=${encodeURIComponent(key)}`);
                        items.push({
                            code_name: result.code_name || key,
                            display_name: result.display_name || key,
                            url: url,
                            icon_path: result.icon_path || '',
                            color_variant: result.color_variant || 'colored'
                        });
                    } catch (error) {
                        // Fallback if API fails
                        items.push({
                            code_name: key,
                            display_name: key.charAt(0).toUpperCase() + key.slice(1),
                            url: url,
                            icon_path: '',
                            color_variant: 'colored'
                        });
                    }
                }
            }

            setSocialItems(items);
            setLoading(false);
        };

        loadSocials();
    }, [data]);

    const handleSelectSocial = (social: any) => {
        setSelectedSocial(social);
        setUrlInput('');
        setUrlError('');
        setIsUrlModalOpen(true);
    };

    const validateInput = (value: string, platform: string): { isValid: boolean; error: string } => {
        if (!value.trim()) {
            return { isValid: false, error: 'This field is required' };
        }

        // Check if it's an email platform
        if (platform.toLowerCase() === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value) && !value.startsWith('mailto:')) {
                return { isValid: false, error: 'Please enter a valid email address' };
            }
            return { isValid: true, error: '' };
        }

        // For all other platforms, validate as URL
        try {
            const url = new URL(value);
            if (!url.protocol.startsWith('http')) {
                return { isValid: false, error: 'URL must start with http:// or https://' };
            }
            return { isValid: true, error: '' };
        } catch {
            return { isValid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
        }
    };

    const handleAddSocial = () => {
        if (!selectedSocial || !urlInput) return;

        // Validate input
        const validation = validateInput(urlInput, selectedSocial.code_name);
        if (!validation.isValid) {
            setUrlError(validation.error);
            return;
        }

        const newItem: SocialItem = {
            code_name: selectedSocial.code_name,
            display_name: selectedSocial.display_name,
            url: urlInput,
            icon_path: selectedSocial.icon_path,
            color_variant: selectedSocial.color_variant
        };

        setSocialItems([...socialItems, newItem]);

        // Update parent data
        const updatedData: any = { ...data };
        updatedData[selectedSocial.code_name] = urlInput;
        onChange(updatedData);

        // Close modals
        setIsUrlModalOpen(false);
        setSelectedSocial(null);
        setUrlInput('');
        setUrlError('');
    };

    const handleRemoveSocial = (codeName: string) => {
        setSocialItems(socialItems.filter(item => item.code_name !== codeName));

        // Update parent data
        const updatedData: any = { ...data };
        delete updatedData[codeName];
        onChange(updatedData);
    };

    const handleUpdateUrl = (codeName: string, newUrl: string) => {
        setSocialItems(socialItems.map(item =>
            item.code_name === codeName ? { ...item, url: newUrl } : item
        ));

        // Update parent data
        const updatedData: any = { ...data };
        updatedData[codeName] = newUrl;
        onChange(updatedData);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                        Social Links
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Add your social media profiles from our registry
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Social
                </button>
            </div>

            {/* Social Items Grid */}
            {loading ? (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    Loading...
                </div>
            ) : socialItems.length > 0 ? (
                <div className="space-y-3">
                    {socialItems.map((item) => (
                        <SocialItem
                            key={item.code_name}
                            item={item}
                            onRemove={() => handleRemoveSocial(item.code_name)}
                            onUpdateUrl={(newUrl) => handleUpdateUrl(item.code_name, newUrl)}
                        />
                    ))}
                </div>
            ) : (
                <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No social links added</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Click "Add Social" to get started
                    </p>
                </div>
            )}

            {/* Social Platform Selection Modal */}
            <SocialModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectSocial}
            />

            {/* URL Input Modal */}
            {isUrlModalOpen && selectedSocial && createPortal(
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsUrlModalOpen(false)}>
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Header with Icon */}
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-4">
                                {/* Social Icon */}
                                <div className="w-12 h-12 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center p-2.5">
                                    {(() => {
                                        const BASE_API_URL = 'https://qgwkmvmz-8000.inc1.devtunnels.ms';
                                        let imageUrl = selectedSocial.icon_path;
                                        if (imageUrl && !imageUrl.startsWith('http')) {
                                            imageUrl = `${BASE_API_URL}${imageUrl}`;
                                        }

                                        const shouldInvertInDark = selectedSocial.color_variant === 'black';
                                        const shouldInvertInLight = selectedSocial.color_variant === 'white';

                                        return imageUrl ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={selectedSocial.display_name}
                                                className={`w-full h-full object-contain ${shouldInvertInDark ? 'dark:invert' : ''} ${shouldInvertInLight ? 'invert dark:invert-0' : ''}`}
                                            />
                                        ) : (
                                            <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        );
                                    })()}
                                </div>
                                
                                {/* Title */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                        {selectedSocial.display_name}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Add your profile link
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Form */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                                    {selectedSocial.code_name.toLowerCase() === 'email' ? 'Email Address' : 'Profile URL'}
                                </label>
                                <input
                                    type={selectedSocial.code_name.toLowerCase() === 'email' ? 'email' : 'url'}
                                    value={urlInput}
                                    onChange={(e) => {
                                        setUrlInput(e.target.value);
                                        setUrlError(''); // Clear error on input change
                                    }}
                                    placeholder={selectedSocial.code_name.toLowerCase() === 'email' 
                                        ? 'your.email@example.com' 
                                        : `https://${selectedSocial.code_name}.com/username`}
                                    className={`w-full px-3 py-2.5 bg-white dark:bg-zinc-800 border rounded-lg text-sm outline-none focus:ring-2 transition-all text-zinc-900 dark:text-zinc-100 ${
                                        urlError 
                                            ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                                            : 'border-zinc-200 dark:border-zinc-700 focus:ring-zinc-900 dark:focus:ring-zinc-100'
                                    }`}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && urlInput) {
                                            handleAddSocial();
                                        } else if (e.key === 'Escape') {
                                            setIsUrlModalOpen(false);
                                            setSelectedSocial(null);
                                            setUrlInput('');
                                            setUrlError('');
                                        }
                                    }}
                                />
                                {urlError && (
                                    <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                                        {urlError}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setIsUrlModalOpen(false);
                                        setSelectedSocial(null);
                                        setUrlInput('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSocial}
                                    disabled={!urlInput}
                                    className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

// Individual social item component
interface SocialItemProps {
    item: SocialItem;
    onRemove: () => void;
    onUpdateUrl: (newUrl: string) => void;
}

function SocialItem({ item, onRemove, onUpdateUrl }: SocialItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editUrl, setEditUrl] = useState(item.url);

    const BASE_API_URL = 'https://qgwkmvmz-8000.inc1.devtunnels.ms';

    let imageUrl = item.icon_path;
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${BASE_API_URL}${imageUrl}`;
    }

    const shouldInvertInDark = item.color_variant === 'black';
    const shouldInvertInLight = item.color_variant === 'white';

    const handleSave = () => {
        onUpdateUrl(editUrl);
        setIsEditing(false);
    };

    return (
        <div className="relative group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-10 h-10 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center p-2">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={item.display_name}
                            className={`w-full h-full object-contain ${shouldInvertInDark ? 'dark:invert' : ''} ${shouldInvertInLight ? 'invert dark:invert-0' : ''}`}
                        />
                    ) : (
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {item.display_name}
                    </p>
                    {isEditing ? (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="text"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                className="flex-1 px-2 py-1 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded"
                                autoFocus
                            />
                            <button
                                onClick={handleSave}
                                className="text-xs text-green-600 dark:text-green-400 hover:underline"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditUrl(item.url);
                                    setIsEditing(false);
                                }}
                                className="text-xs text-zinc-500 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {item.url}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Edit URL"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={onRemove}
                        className="p-1.5 text-red-500 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Remove"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

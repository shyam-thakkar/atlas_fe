import React from 'react';
import { HeroSection } from '@/types/portfolio';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';
import { AITextarea } from '@/components/ui/AITextarea';

interface HeroEditorProps {
    data: HeroSection | null;
    onChange: (data: HeroSection) => void;
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
    const hero = data || { full_name: '', headline: '', short_bio: '' };
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("File is too large. Max 5MB.");
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('profile_photo', file);

            // Import apiRequest dynamically or from lib
            const { apiRequest } = await import('@/lib/api');

            console.log('📤 Uploading file...');
            // Allow for either key to be safe, defaulting to profile_image based on user input
            const response = await apiRequest<{ profile_image?: string, profile_photo_url?: string }>('/api/profile/portfolio/photo/', {
                method: 'POST',
                body: formData
            });
            console.log('📥 Upload response:', response);

            const newUrl = response.profile_image || response.profile_photo_url;

            if (newUrl) {
                console.log('✅ Setting profile image:', newUrl);
                onChange({ ...hero, profile_image: newUrl });
            } else {
                console.warn('⚠️ No profile_image url found in response:', response);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert("Failed to upload photo. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Photo Upload */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {hero.profile_image ? (
                            <img
                                key={hero.profile_image}
                                src={hero.profile_image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        >
                            {hero.profile_image ? 'Change Photo' : 'Upload Photo'}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                            Recommended: Square JPG/PNG, max 5MB
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
                <input
                    type="text"
                    value={hero.full_name}
                    onChange={e => onChange({ ...hero, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    placeholder="Jane Doe"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Headline</label>
                <AITextarea
                    section="headline"
                    value={hero.headline || ''}
                    onChange={e => onChange({ ...hero, headline: e.target.value })}
                    onAIRewrite={(newContent) => onChange({ ...hero, headline: newContent })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none overflow-hidden"
                    placeholder="Software Engineer | React Enthusiast"
                    rows={1}
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Short Bio</label>
                <AITextarea
                    section="bio_short"
                    value={hero.short_bio || ''}
                    onChange={e => onChange({ ...hero, short_bio: e.target.value })}
                    onAIRewrite={(newContent) => onChange({ ...hero, short_bio: newContent })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none min-h-[60px]"
                    placeholder="Briefly introduce yourself..."
                    rows={2}
                />
            </div>
        </div>
    );
}

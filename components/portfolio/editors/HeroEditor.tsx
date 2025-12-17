import React from 'react';
import { HeroSection } from '@/types/portfolio';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';

interface HeroEditorProps {
    data: HeroSection | null;
    onChange: (data: HeroSection) => void;
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
    const hero = data || { full_name: '', headline: '', short_bio: '' };

    return (
        <div className="space-y-6">
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
                <input
                    type="text"
                    value={hero.headline}
                    onChange={e => onChange({ ...hero, headline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    placeholder="Software Engineer | React Enthusiast"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Short Bio</label>
                <AutoResizeTextarea
                    value={hero.short_bio}
                    onChange={e => onChange({ ...hero, short_bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    placeholder="Briefly introduce yourself..."
                    rows={2}
                />
            </div>
        </div>
    );
}

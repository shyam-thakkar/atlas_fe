import React from 'react';
import { AboutSection } from '@/types/portfolio';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';

interface AboutEditorProps {
    data: AboutSection | null;
    onChange: (data: AboutSection) => void;
}

export function AboutEditor({ data, onChange }: AboutEditorProps) {
    const about = data || { long_bio: '' };

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Detailed Bio</label>
                <AutoResizeTextarea
                    value={about.long_bio}
                    onChange={e => onChange({ ...about, long_bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-base leading-relaxed"
                    placeholder="Tell your professional story..."
                    rows={6}
                />
                <p className="text-sm text-gray-500 mt-2">This is the place to go into detail about your background, philosophy, and journey.</p>
            </div>
        </div>
    );
}

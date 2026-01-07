import React, { useRef, useState } from 'react';
import { AboutSection } from '@/types/portfolio';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';
import { TechBadgeModal } from './modals/TechBadgeModal';
import { Plus } from 'lucide-react';

interface AboutEditorProps {
    data: AboutSection | null;
    onChange: (data: AboutSection) => void;
}

export function AboutEditor({ data, onChange }: AboutEditorProps) {
    const about = data || { long_bio: '' };
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const insertCode = (code: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = about.long_bio || '';
        const before = text.substring(0, start);
        const after = text.substring(end);

        const newText = before + code + after;
        onChange({ ...about, long_bio: newText });

        // Restore focus and cursor position after React rerender
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + code.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Detailed Bio</label>

                {/* Toolbar */}
                <div className="mb-3 flex flex-wrap items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Tech Badge
                    </button>
                    <div className="h-4 w-px bg-gray-300 mx-2" />
                    <span className="text-xs text-gray-500">
                        Inserts <code className="bg-white border border-gray-200 px-1 rounded text-gray-700">{'{{TechName}}'}</code> placeholders
                    </span>
                </div>

                <div className="relative">
                    <AutoResizeTextarea
                        ref={textareaRef}
                        value={about.long_bio}
                        onChange={e => onChange({ ...about, long_bio: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-base leading-relaxed font-mono text-sm min-h-[200px]"
                        placeholder="Tell your professional story... Click 'Add Tech Badge' to insert interactive badges."
                        rows={8}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Write your bio naturally. Tech badges will be rendered as interactive icons in your portfolio.
                </p>
            </div>

            <TechBadgeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(badges) => {
                    // Insert all selected badges at cursor position
                    const codes = badges.map(badge => {
                        const code = badge.code_name || badge.name?.toLowerCase().replace(/\s+/g, '') || 'unknown';
                        return `{{${code}}}`;
                    });
                    insertCode(codes.join(' '));
                }}
            />
        </div>
    );
}

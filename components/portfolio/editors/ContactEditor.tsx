import React from 'react';
import { ContactSection } from '@/types/portfolio';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';

interface ContactEditorProps {
    data: ContactSection | null | undefined;
    onChange: (data: ContactSection | null) => void;
}

const DEFAULT_MESSAGE = "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out through any of the social links!";
const DEFAULT_CTA = "Get in Touch";

export function ContactEditor({ data, onChange }: ContactEditorProps) {
    // Check if section is deleted (null or empty object)
    const isDeleted = !data || (Object.keys(data).length === 0);

    // If section exists, use the values (or show defaults in placeholders)
    const contact = data || { message: '', cta_text: '' };

    // Display values: show actual value or default if empty
    const displayMessage = contact.message || DEFAULT_MESSAGE;
    const displayCta = contact.cta_text || DEFAULT_CTA;

    // Handle delete - sets to empty object {} which tells backend to hide section
    const handleDelete = () => {
        onChange(null);
    };

    // Handle restore - re-initializes with empty strings (will show defaults)
    const handleRestore = () => {
        onChange({ message: '', cta_text: '' });
    };

    // If section is deleted, show restore option
    if (isDeleted) {
        return (
            <div className="space-y-6">
                <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                        Connect Section Removed
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
                        The Connect section is currently hidden from your portfolio. Add it back to display a contact message and social links.
                    </p>
                    <button
                        onClick={handleRestore}
                        className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        Add Connect Section
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm relative">
                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-full transition-all"
                    title="Remove Connect Section"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Section Header */}
                <div className="mb-6 pr-10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                        Connect Section
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                        Customize the message shown in your portfolio's contact section. Leave empty to use default text.
                    </p>
                </div>

                {/* Contact Message */}
                <div className="mb-5">
                    <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                        Contact Message
                    </label>
                    <AutoResizeTextarea
                        value={contact.message || ''}
                        onChange={e => onChange({ ...contact, message: e.target.value })}
                        className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all leading-relaxed placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                        placeholder={DEFAULT_MESSAGE}
                        rows={3}
                    />
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1.5">
                        {contact.message ? 'Custom message will be shown.' : 'Using default message. Type to customize.'}
                    </p>
                </div>

                {/* CTA Text */}
                <div>
                    <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                        Call-to-Action Text <span className="text-gray-400 dark:text-zinc-500 font-normal normal-case">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        value={contact.cta_text || ''}
                        onChange={e => onChange({ ...contact, cta_text: e.target.value })}
                        className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-zinc-500 placeholder:font-normal"
                        placeholder={DEFAULT_CTA}
                    />
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1.5">
                        Optional button text like "Get in Touch" or "Hire Me".
                    </p>
                </div>
            </div>

            {/* Info Card */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                            How it works
                        </p>
                        <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-0.5">
                            Your social links from the "Social Links" section will automatically appear in the Connect section. Remove this section if you don't want a contact area on your portfolio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

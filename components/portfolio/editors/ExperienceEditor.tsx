import React from 'react';
import { ExperienceItem } from '@/types/portfolio';
import { DateSelector } from '@/components/ui/DateSelector';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';
import { AITextarea } from '@/components/ui/AITextarea';

interface ExperienceEditorProps {
    data: ExperienceItem[] | null;
    onChange: (data: ExperienceItem[]) => void;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENT_YEAR = new Date().getFullYear();

export function ExperienceEditor({ data, onChange }: ExperienceEditorProps) {
    const experience = data || [];

    return (
        <div className="space-y-6">
            {experience.map((exp, i) => (
                <div key={i} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm relative group animate-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={() => onChange(experience.filter((_, idx) => idx !== i))}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                        title="Remove Item"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="grid grid-cols-2 gap-5 mb-5 mt-2">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Role</label>
                            <input
                                type="text" value={exp.role || ''}
                                onChange={e => {
                                    const newExp = [...experience];
                                    newExp[i] = { ...newExp[i], role: e.target.value };
                                    onChange(newExp);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium"
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Company</label>
                            <input
                                type="text" value={exp.company_name || ''}
                                onChange={e => {
                                    const newExp = [...experience];
                                    newExp[i] = { ...newExp[i], company_name: e.target.value };
                                    onChange(newExp);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium"
                                placeholder="e.g. Acacia"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">
                            Company Logo
                        </label>
                        <div className="flex items-start gap-4">
                            {/* Logo Preview */}
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                {exp.logo_url ? (
                                    <img
                                        src={exp.logo_url}
                                        alt={`${exp.company_name} logo`}
                                        className="w-full h-full object-contain p-1"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Upload/URL Input */}
                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id={`logo-upload-${i}`}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            if (file.size > 2 * 1024 * 1024) {
                                                alert("Logo file is too large. Max 2MB.");
                                                return;
                                            }
                                            if (!file.type.startsWith('image/')) {
                                                alert("Please upload an image file.");
                                                return;
                                            }

                                            try {
                                                const formData = new FormData();
                                                formData.append('logo', file);
                                                formData.append('company_name', exp.company_name || 'Unknown');

                                                const { apiRequest } = await import('@/lib/api');
                                                const response = await apiRequest<{ logo_url: string }>('/api/profile/portfolio/company-logo/', {
                                                    method: 'POST',
                                                    body: formData
                                                });

                                                if (response.logo_url) {
                                                    const newExp = [...experience];
                                                    newExp[i] = { ...newExp[i], logo_url: response.logo_url };
                                                    onChange(newExp);
                                                }
                                            } catch (error) {
                                                console.error('Logo upload failed:', error);
                                                alert("Failed to upload logo. Please try again.");
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById(`logo-upload-${i}`)?.click()}
                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Upload Logo
                                    </button>
                                    <span className="text-xs text-gray-400 self-center">or</span>
                                </div>
                                <input
                                    type="url"
                                    value={exp.logo_url || ''}
                                    onChange={e => {
                                        const newExp = [...experience];
                                        newExp[i] = { ...newExp[i], logo_url: e.target.value };
                                        onChange(newExp);
                                    }}
                                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-600 placeholder:font-normal"
                                    placeholder="Or paste logo URL: https://example.com/logo.png"
                                />
                                <p className="text-xs text-gray-500">
                                    Upload a logo file or paste a URL. Max 2MB.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                            <DateSelector
                                label="Start Date"
                                value={exp.start_date}
                                onChange={(val) => {
                                    const newExp = [...experience];
                                    newExp[i] = { ...newExp[i], start_date: val || '' };
                                    onChange(newExp);
                                }}
                            />
                        </div>
                        <div>
                            <DateSelector
                                label="End Date"
                                value={exp.end_date}
                                isEndDate={true}
                                onChange={(val) => {
                                    const newExp = [...experience];
                                    newExp[i] = {
                                        ...newExp[i],
                                        end_date: val,
                                        is_current: val === 'Present'
                                    };
                                    onChange(newExp);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">
                            Summary <span className="text-gray-400 font-normal normal-case ml-1">(Each new line will be a bullet point)</span>
                        </label>
                        <AITextarea
                            section="experience"
                            itemIndex={i}
                            value={exp.description || ''}
                            onChange={e => {
                                const newExp = [...experience];
                                newExp[i] = { ...newExp[i], description: e.target.value };
                                onChange(newExp);
                            }}
                            onAIRewrite={(newContent) => {
                                const newExp = [...experience];
                                newExp[i] = { ...newExp[i], description: newContent };
                                onChange(newExp);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all leading-relaxed resize-none min-h-[80px]"
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={() => onChange([...experience, { role: '', company_name: '', start_date: `${MONTHS[0]} ${CURRENT_YEAR}`, end_date: 'Present', is_current: true, description: '', logo_url: '' }])}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
            >
                <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                Add Experience Position
            </button>
        </div>
    );
}

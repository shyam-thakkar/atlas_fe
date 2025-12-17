import React from 'react';
import { ExperienceItem } from '@/types/portfolio';
import { DateSelector } from '@/components/ui/DateSelector';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';

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
                                type="text" value={exp.company || ''}
                                onChange={e => {
                                    const newExp = [...experience];
                                    newExp[i] = { ...newExp[i], company: e.target.value };
                                    onChange(newExp);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium"
                                placeholder="e.g. Acacia"
                            />
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
                                    newExp[i] = { ...newExp[i], end_date: val };
                                    onChange(newExp);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Summary</label>
                        <AutoResizeTextarea
                            value={exp.summary || ''}
                            onChange={e => {
                                const newExp = [...experience];
                                newExp[i] = { ...newExp[i], summary: e.target.value };
                                onChange(newExp);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all leading-relaxed"
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={() => onChange([...experience, { role: '', company: '', start_date: `${MONTHS[0]} ${CURRENT_YEAR}`, end_date: 'Present', summary: '' }])}
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

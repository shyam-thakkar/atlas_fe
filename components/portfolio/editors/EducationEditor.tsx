import React from 'react';
import { EducationItem } from '@/types/portfolio';
import { DateSelector } from '@/components/ui/DateSelector';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';

interface EducationEditorProps {
    data: EducationItem[] | null;
    onChange: (data: EducationItem[]) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

const GRADE_TYPES = [
    { value: 'cgpa', label: 'CGPA' },
    { value: 'sgpa', label: 'SGPA' },
    { value: 'gpa', label: 'GPA' },
    { value: 'percentage', label: 'Percentage' },
];

export function EducationEditor({ data, onChange }: EducationEditorProps) {
    const education = data || [];

    return (
        <div className="space-y-6">
            {education.map((edu, i) => (
                <div key={i} className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm relative group animate-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={() => onChange(education.filter((_, idx) => idx !== i))}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-full transition-all"
                        title="Remove Item"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {/* Institution */}
                    <div className="mb-5 mt-2">
                        <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                            Institution
                        </label>
                        <input
                            type="text"
                            value={edu.institution || ''}
                            onChange={e => {
                                const newEdu = [...education];
                                newEdu[i] = { ...newEdu[i], institution: e.target.value };
                                onChange(newEdu);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all font-medium"
                            placeholder="e.g. Stanford University"
                        />
                    </div>

                    {/* Degree and Field of Study */}
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                                Degree
                            </label>
                            <input
                                type="text"
                                value={edu.degree || ''}
                                onChange={e => {
                                    const newEdu = [...education];
                                    newEdu[i] = { ...newEdu[i], degree: e.target.value };
                                    onChange(newEdu);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all font-medium"
                                placeholder="e.g. Bachelor's degree"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                                Field of Study
                            </label>
                            <input
                                type="text"
                                value={edu.field_of_study || ''}
                                onChange={e => {
                                    const newEdu = [...education];
                                    newEdu[i] = { ...newEdu[i], field_of_study: e.target.value };
                                    onChange(newEdu);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all font-medium"
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                    </div>

                    {/* Grade and Grade Type */}
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                                Grade
                            </label>
                            <input
                                type="text"
                                value={edu.grade || ''}
                                onChange={e => {
                                    const newEdu = [...education];
                                    newEdu[i] = { ...newEdu[i], grade: e.target.value };
                                    onChange(newEdu);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all font-medium"
                                placeholder="e.g. 8.73 or 85%"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                                Grade Type
                            </label>
                            <select
                                value={edu.grade_type || 'cgpa'}
                                onChange={e => {
                                    const newEdu = [...education];
                                    newEdu[i] = { ...newEdu[i], grade_type: e.target.value };
                                    onChange(newEdu);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all font-medium"
                            >
                                {GRADE_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Start and End Dates */}
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                            <DateSelector
                                label="Start Date"
                                value={edu.start_date}
                                onChange={(val) => {
                                    const newEdu = [...education];
                                    newEdu[i] = { ...newEdu[i], start_date: val || '' };
                                    onChange(newEdu);
                                }}
                                context="education"
                                allowYearOnly={true}
                            />
                        </div>
                        <div>
                            <DateSelector
                                label="End Date"
                                value={edu.end_date}
                                isEndDate={true}
                                onChange={(val) => {
                                    const newEdu = [...education];
                                    newEdu[i] = { ...newEdu[i], end_date: val || '' };
                                    onChange(newEdu);
                                }}
                                context="education"
                                allowYearOnly={true}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                            Description <span className="text-gray-400 dark:text-zinc-500 font-normal normal-case ml-1">(Optional - achievements, activities, etc.)</span>
                        </label>
                        <AutoResizeTextarea
                            value={edu.description || ''}
                            onChange={e => {
                                const newEdu = [...education];
                                newEdu[i] = { ...newEdu[i], description: e.target.value };
                                onChange(newEdu);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all leading-relaxed"
                            placeholder="Describe your achievements, activities, or relevant coursework..."
                            rows={2}
                        />
                    </div>
                </div>
            ))}

            {/* Add Education Button */}
            <button
                onClick={() => onChange([...education, {
                    institution: '',
                    degree: '',
                    field_of_study: '',
                    grade: '',
                    grade_type: 'cgpa',
                    start_date: `January ${CURRENT_YEAR - 4}`,
                    end_date: `January ${CURRENT_YEAR}`,
                    description: ''
                }])}
                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-center gap-2 group"
            >
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                Add Education
            </button>
        </div>
    );
}

import React from 'react';
import { ProjectItem } from '@/types/portfolio';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';
import { StringArrayInput } from '@/components/ui/StringArrayInput';

interface ProjectsEditorProps {
    data: ProjectItem[] | null;
    onChange: (data: ProjectItem[]) => void;
}

export function ProjectsEditor({ data, onChange }: ProjectsEditorProps) {
    const projects = data || [];

    return (
        <div className="space-y-6">
            {projects.map((proj, i) => (
                <div key={i} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm relative group animate-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={() => onChange(projects.filter((_, idx) => idx !== i))}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                        title="Remove Project"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="mb-4 pr-10">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Project Name</label>
                        <input
                            type="text" value={proj.name || ''}
                            onChange={e => {
                                const newProj = [...projects];
                                newProj[i] = { ...newProj[i], name: e.target.value };
                                onChange(newProj);
                            }}
                            className="w-full text-base font-semibold px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                            placeholder="e.g. My Portfolio Website"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Description</label>
                        <AutoResizeTextarea
                            value={proj.description || ''}
                            onChange={e => {
                                const newProj = [...projects];
                                newProj[i] = { ...newProj[i], description: e.target.value };
                                onChange(newProj);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                            placeholder="A brief overview of the project..."
                            rows={2}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Tech Stack</label>
                        <StringArrayInput
                            value={proj.technologies}
                            onChange={(newTechs) => {
                                const newProj = [...projects];
                                newProj[i] = { ...newProj[i], technologies: newTechs };
                                onChange(newProj);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                            placeholder="React, Node.js, Python..."
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.technologies?.map(s => s.trim()).filter(Boolean).map((tech, idx) => (
                                <span key={idx} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">{tech}</span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">GitHub Link</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                </span>
                                <input
                                    type="text" value={proj.github_link || ''}
                                    onChange={e => {
                                        const newProj = [...projects];
                                        newProj[i] = { ...newProj[i], github_link: e.target.value };
                                        onChange(newProj);
                                    }}
                                    className="w-full text-sm pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Live Link</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </span>
                                <input
                                    type="text" value={proj.live_link || ''}
                                    onChange={e => {
                                        const newProj = [...projects];
                                        newProj[i] = { ...newProj[i], live_link: e.target.value };
                                        onChange(newProj);
                                    }}
                                    className="w-full text-sm pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={() => onChange([...projects, { name: 'New Project', description: '', technologies: [], github_link: '' }])}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
            >
                <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                Add Project
            </button>
        </div>
    );
}

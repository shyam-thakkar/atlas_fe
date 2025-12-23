import React, { useEffect, useState } from 'react';
import { ProjectItem } from '@/types/portfolio';
import { AutoResizeTextarea } from '@/components/ui/AutoResizeTextarea';
import { TechBadgeModal } from './modals/TechBadgeModal';
import { TechBadgeData } from '@/types/tech-badge';
import { apiRequest } from '@/lib/api';

// Mini tech icon component for Projects Editor - smaller than TechStackItem, with remove button
interface MiniTechItemProps {
    codeName: string;
    onRemove: () => void;
}

function MiniTechItem({ codeName, onRemove }: MiniTechItemProps) {
    const [techData, setTechData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchTech = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/tech/search/?q=${encodeURIComponent(codeName)}`);
                if (response.ok) {
                    const data = await response.json();
                    setTechData(data);
                    setNotFound(false);
                } else if (response.status === 404) {
                    setNotFound(true);
                }
            } catch (error) {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchTech();
    }, [codeName]);

    if (loading) {
        return <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-700 rounded-lg animate-pulse" />;
    }

    if (notFound || !techData?.icon_path) {
        return (
            <div className="relative group">
                <button
                    onClick={onRemove}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
                    title="Remove"
                >
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div 
                    className="w-10 h-10 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg flex flex-col items-center justify-center p-1"
                    title={codeName}
                >
                    <span className="text-[8px] font-bold text-amber-600 dark:text-amber-400 uppercase truncate w-full text-center">
                        {codeName.slice(0, 4)}
                    </span>
                </div>
            </div>
        );
    }

    const iconUrl = techData.icon_path.startsWith('http')
        ? techData.icon_path
        : `${process.env.NEXT_PUBLIC_API_URL}${techData.icon_path}`;

    const shouldInvertInDark = techData.color_variant === 'black';
    const shouldInvertInLight = techData.color_variant === 'white';

    return (
        <div className="relative group">
            <button
                onClick={onRemove}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
                title="Remove"
            >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div 
                className="w-10 h-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center p-1 hover:border-gray-300 dark:hover:border-zinc-600 transition-colors"
                title={techData.display_name || codeName}
            >
                <img
                    src={iconUrl}
                    alt={techData.display_name || codeName}
                    className={`w-6 h-6 object-contain ${shouldInvertInDark ? 'dark:invert' : ''} ${shouldInvertInLight ? 'invert dark:invert-0' : ''}`}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            </div>
        </div>
    );
}

interface ProjectsEditorProps {
    data: ProjectItem[] | null;
    onChange: (data: ProjectItem[]) => void;
}

export function ProjectsEditor({ data, onChange }: ProjectsEditorProps) {
    const projects = data || [];
    
    // Local state to preserve cursor position in textareas
    const [keyFeaturesText, setKeyFeaturesText] = React.useState<string[]>([]);
    const [technicalChallengesText, setTechnicalChallengesText] = React.useState<string[]>([]);
    
    // Modal state for tech selection - tracks which project's modal is open
    const [techModalOpenIndex, setTechModalOpenIndex] = useState<number | null>(null);

    // Initialize text state from array data
    useEffect(() => {
        setKeyFeaturesText(projects.map(p => (p.key_features || []).join('\n')));
        setTechnicalChallengesText(projects.map(p => (p.technical_challenges || []).join('\n')));
    }, [projects.length]); // Only re-init when projects array length changes
    
    // Handle adding a technology to a specific project
    const handleAddTech = async (projectIndex: number, badge: TechBadgeData) => {
        try {
            let codeName = badge.code_name;
            if (!codeName) {
                const response = await apiRequest<any>(`/api/profile/tech/search/?q=${encodeURIComponent(badge.name)}`);
                codeName = response?.code_name || badge.name.toLowerCase().replace(/\s+/g, '-');
            }
            
            const currentTechs = projects[projectIndex].technologies || [];
            if (codeName && !currentTechs.includes(codeName)) {
                const newProj = [...projects];
                newProj[projectIndex] = { ...newProj[projectIndex], technologies: [...currentTechs, codeName] };
                onChange(newProj);
            }
        } catch (error) {
            console.error('Failed to add tech:', error);
            const codeName = badge.name.toLowerCase().replace(/\s+/g, '-');
            const currentTechs = projects[projectIndex].technologies || [];
            if (!currentTechs.includes(codeName)) {
                const newProj = [...projects];
                newProj[projectIndex] = { ...newProj[projectIndex], technologies: [...currentTechs, codeName] };
                onChange(newProj);
            }
        }
    };
    
    // Handle removing a technology from a specific project
    const handleRemoveTech = (projectIndex: number, techCodeName: string) => {
        const newProj = [...projects];
        const currentTechs = projects[projectIndex].technologies || [];
        newProj[projectIndex] = { ...newProj[projectIndex], technologies: currentTechs.filter(t => t !== techCodeName) };
        onChange(newProj);
    };

    return (
        <div className="space-y-6">
            {projects.map((proj, i) => (
                <div key={i} className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm relative group animate-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={() => onChange(projects.filter((_, idx) => idx !== i))}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-full transition-all"
                        title="Remove Project"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="mb-4 pr-10">
                        <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">Project Title</label>
                        <input
                            type="text" value={proj.title || ''}
                            onChange={e => {
                                const newProj = [...projects];
                                newProj[i] = { ...newProj[i], title: e.target.value };
                                onChange(newProj);
                            }}
                            className="w-full text-base font-semibold px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g. My Portfolio Website"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">Description</label>
                        <AutoResizeTextarea
                            value={proj.description || ''}
                            onChange={e => {
                                const newProj = [...projects];
                                newProj[i] = { ...newProj[i], description: e.target.value };
                                onChange(newProj);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all"
                            placeholder="A brief overview of the project..."
                            rows={2}
                        />
                    </div>
                    
                    {/* Tech Stack - Modal-based selection like TechStackEditor */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide">Tech Stack</label>
                            <button
                                onClick={() => setTechModalOpenIndex(i)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Tech
                            </button>
                        </div>
                        
                        {/* Tech Icons Grid */}
                        {proj.technologies && proj.technologies.filter(t => t.trim()).length > 0 ? (
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-700">
                                {proj.technologies.map(s => s.trim()).filter(Boolean).map((tech, idx) => (
                                    <MiniTechItem 
                                        key={idx} 
                                        codeName={tech} 
                                        onRemove={() => handleRemoveTech(i, tech)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg p-4 text-center">
                                <p className="text-xs text-gray-400 dark:text-zinc-500">No technologies added. Click "Add Tech" to select.</p>
                            </div>
                        )}
                        
                        {/* Tech Badge Modal for this project */}
                        <TechBadgeModal
                            isOpen={techModalOpenIndex === i}
                            onClose={() => setTechModalOpenIndex(null)}
                            onSelect={(badge) => handleAddTech(i, badge)}
                        />
                    </div>

                    {/* Key Features */}
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                            Key Features <span className="text-gray-400 dark:text-zinc-500 font-normal normal-case ml-1">(Optional - Each new line will be a bullet point)</span>
                        </label>
                        <AutoResizeTextarea
                            value={keyFeaturesText[i] || ''}
                            onChange={e => {
                                // Update local text state
                                const newTextState = [...keyFeaturesText];
                                newTextState[i] = e.target.value;
                                setKeyFeaturesText(newTextState);

                                // Update project data with array
                                const newProj = [...projects];
                                const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
                                newProj[i] = { ...newProj[i], key_features: lines };
                                onChange(newProj);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all leading-relaxed"
                            placeholder="Real-time data processing&#10;User authentication&#10;Responsive design"
                            rows={3}
                        />
                    </div>

                    {/* Technical Challenges */}
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide block mb-1.5">
                            Technical Challenges <span className="text-gray-400 dark:text-zinc-500 font-normal normal-case ml-1">(Optional - Each new line will be a bullet point)</span>
                        </label>
                        <AutoResizeTextarea
                            value={technicalChallengesText[i] || ''}
                            onChange={e => {
                                // Update local text state
                                const newTextState = [...technicalChallengesText];
                                newTextState[i] = e.target.value;
                                setTechnicalChallengesText(newTextState);

                                // Update project data with array
                                const newProj = [...projects];
                                const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
                                newProj[i] = { ...newProj[i], technical_challenges: lines };
                                onChange(newProj);
                            }}
                            className="w-full text-sm px-3 py-2.5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all leading-relaxed"
                            placeholder="Optimizing performance&#10;Scaling infrastructure&#10;Managing state complexity"
                            rows={3}
                        />
                    </div>

                    {/* Year and Project Type */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">
                                Year <span className="text-gray-400 font-normal normal-case ml-1">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={proj.year || ''}
                                onChange={e => {
                                    const newProj = [...projects];
                                    newProj[i] = { ...newProj[i], year: e.target.value };
                                    onChange(newProj);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                placeholder="2024"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">
                                Project Type <span className="text-gray-400 font-normal normal-case ml-1">(Optional)</span>
                            </label>
                            <select
                                value={proj.project_type || ''}
                                onChange={e => {
                                    const newProj = [...projects];
                                    newProj[i] = { ...newProj[i], project_type: e.target.value };
                                    onChange(newProj);
                                }}
                                className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all bg-white"
                            >
                                <option value="">Select type...</option>
                                <option value="Solo Project">Solo Project</option>
                                <option value="Team Project">Team Project</option>
                                <option value="Open Source">Open Source</option>
                                <option value="Client Work">Client Work</option>
                                <option value="Hackathon">Hackathon</option>
                            </select>
                        </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">
                            Project Thumbnail <span className="text-gray-400 font-normal normal-case ml-1">(Optional)</span>
                        </label>
                        <div className="flex items-start gap-4">
                            {/* Thumbnail Preview */}
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                {proj.thumbnail_url ? (
                                    <img
                                        src={proj.thumbnail_url}
                                        alt={`${proj.title} thumbnail`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                                        id={`thumbnail-upload-${i}`}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            if (file.size > 5 * 1024 * 1024) {
                                                alert("Thumbnail is too large. Max 5MB.");
                                                return;
                                            }
                                            if (!file.type.startsWith('image/')) {
                                                alert("Please upload an image file.");
                                                return;
                                            }

                                            try {
                                                const formData = new FormData();
                                                formData.append('thumbnail', file);
                                                formData.append('project_title', proj.title || 'Untitled');

                                                const { apiRequest } = await import('@/lib/api');
                                                const response = await apiRequest<{ thumbnail_url: string }>('/api/profile/portfolio/project-thumbnail/', {
                                                    method: 'POST',
                                                    body: formData
                                                });

                                                if (response.thumbnail_url) {
                                                    const newProj = [...projects];
                                                    newProj[i] = { ...newProj[i], thumbnail_url: response.thumbnail_url };
                                                    onChange(newProj);
                                                }
                                            } catch (error) {
                                                console.error('Thumbnail upload failed:', error);
                                                alert("Failed to upload thumbnail. Please try again.");
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById(`thumbnail-upload-${i}`)?.click()}
                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Upload Image
                                    </button>
                                    <span className="text-xs text-gray-400 self-center">or</span>
                                </div>
                                <input
                                    type="url"
                                    value={proj.thumbnail_url || ''}
                                    onChange={e => {
                                        const newProj = [...projects];
                                        newProj[i] = { ...newProj[i], thumbnail_url: e.target.value };
                                        onChange(newProj);
                                    }}
                                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-600 placeholder:font-normal"
                                    placeholder="Or paste image URL: https://example.com/screenshot.png"
                                />
                                <p className="text-xs text-gray-500">
                                    Upload a screenshot or paste a URL. Max 5MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">GitHub Link</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                </span>
                                <input
                                    type="text" value={proj.repo_url || ''}
                                    onChange={e => {
                                        const newProj = [...projects];
                                        newProj[i] = { ...newProj[i], repo_url: e.target.value };
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
                                    type="text" value={proj.live_url || ''}
                                    onChange={e => {
                                        const newProj = [...projects];
                                        newProj[i] = { ...newProj[i], live_url: e.target.value };
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
                onClick={() => onChange([...projects, { 
                    title: 'New Project', 
                    description: '', 
                    technologies: [], 
                    repo_url: '', 
                    live_url: '',
                    key_features: [],
                    technical_challenges: [],
                    year: '',
                    project_type: '',
                    thumbnail_url: null
                }])}
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

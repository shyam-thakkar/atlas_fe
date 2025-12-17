import React, { useState, useEffect } from 'react';
import { StructuredPortfolio } from '@/types/portfolio';
import { profile } from '@/lib/profile';
import { HeroEditor } from './editors/HeroEditor';
import { TechStackEditor } from './editors/TechStackEditor';
import { ExperienceEditor } from './editors/ExperienceEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { AboutEditor } from './editors/AboutEditor';

interface PortfolioManagerProps {
    onFinish?: () => void;
    isModal?: boolean;
}

const STEPS = [
    { id: 'hero', title: 'Start with the Basics', description: 'Introduce yourself with a punchy headline and bio.' },
    { id: 'tech_stack', title: 'Your Arsenal', description: 'List the technologies and tools you excel at.' },
    { id: 'experience', title: 'Professional Journey', description: 'Where have you worked? What did you accomplish?' },
    { id: 'projects', title: 'Key Projects', description: 'Showcase your best work and side projects.' },
    { id: 'about', title: 'The Full Story', description: 'Go into more detail about your background and philosophy.' },
];

export function PortfolioManager({ onFinish, isModal = false }: PortfolioManagerProps) {
    const [data, setData] = useState<StructuredPortfolio | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Default to read-only
    const [editedData, setEditedData] = useState<StructuredPortfolio | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        profile.getStructuredPortfolio()
            .then(data => {
                setData(data);
                setEditedData(data); // Initialize edited data
            })
            .catch((err) => {
                console.error("Failed to load portfolio", err);
                if (err.message?.includes('409') || err.status === 409) {
                    setError("Processing not finished. Please wait for the analysis to complete.");
                } else if (err.status === 404) {
                    setError("No resume found. Please upload a resume first to generate your portfolio.");
                } else {
                    setError("Failed to load portfolio data. Please try again.");
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleUpdate = (section: keyof StructuredPortfolio, newData: any) => {
        if (!editedData) return;
        setEditedData({ ...editedData, [section]: newData });
    };

    const handleSave = async () => {
        if (!editedData || !data) return;
        setIsSaving(true);
        setError(null);

        try {
            // Save the FULL portfolio data
            await profile.saveFullPortfolio(editedData);

            // Explicitly confirm the review to finalize the pipeline
            await profile.confirmReview();

            // Update local "source of truth"
            setData(editedData);
            setIsEditing(false); // Exit edit mode

            if (onFinish) onFinish(); // Triggers status refresh in parent

        } catch (err: any) {
            console.error("Failed to save portfolio", err);
            if (err.status === 400 && err.missing_items) {
                const items = Array.isArray(err.missing_items) ? err.missing_items.join(', ') : err.missing_items;
                setError(`Cannot publish: Missing required fields (${items}). Please fill them out.`);
            } else {
                setError("Failed to save. Please try again.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Cancel edits
            setEditedData(data); // Revert
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const currentStepConfig = STEPS[currentStep];

    const containerInfoClass = isModal
        ? "bg-white w-full max-w-[90vw] h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300"
        : "bg-white w-full h-full flex";

    return (
        <div className={containerInfoClass}>
            {/* LEFT PANEL: NAVIGATION */}
            <div className="w-[280px] bg-gray-50 border-r border-gray-200 flex flex-col h-full flex-shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white/50 backdrop-blur sticky top-0 z-10">
                    <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Portfolio Sections</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <nav className="space-y-2">
                        {STEPS.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={`w-full flex items-start p-4 rounded-xl text-left transition-all ${currentStep === index
                                    ? 'bg-white shadow-md border border-gray-200 ring-1 ring-black/5 scale-[1.02]'
                                    : 'hover:bg-gray-100 hover:scale-[1.01] text-gray-600'
                                    }`}
                            >
                                <div className={`mt-1 w-2.5 h-2.5 rounded-full mr-4 flex-shrink-0 ${currentStep === index ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                <div>
                                    <span className={`block text-base font-bold ${currentStep === index ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {step.title}
                                    </span>
                                    {currentStep === index && (
                                        <span className="block text-xs text-gray-500 mt-1 leading-relaxed">
                                            {step.description}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* RIGHT PANEL: EDITOR */}
            <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            <span className="text-sm font-bold text-indigo-600 tracking-wide uppercase">
                                {isEditing ? "Editing Portfolio" : "Reviewing Portfolio"}
                            </span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{currentStepConfig.title}</h2>
                        <p className="text-lg text-gray-500 mt-2 font-medium">{currentStepConfig.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={toggleEdit}
                                    className="px-6 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Edit Portfolio
                                </button>
                                {onFinish && (
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || !editedData}
                                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Finalizing...
                                            </>
                                        ) : (
                                            <>Looks Good, Continue</>
                                        )}
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={toggleEdit}
                                    className="px-4 py-2.5 text-gray-600 font-medium text-sm hover:text-gray-900 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-black text-white rounded-lg font-medium text-sm shadow-lg shadow-gray-200 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>Save All Changes</>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Editor Content Area */}
                <div className={`flex-1 overflow-y-auto p-6 bg-white ${!isEditing ? 'pointer-events-none opacity-80 grayscale-[0.3]' : ''}`}>
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <span className="text-gray-500 font-medium">Loading your portfolio...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center">
                            {error.includes('resume') ? (
                                <div className="max-w-md text-center p-8 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-indigo-900 mb-2">Resume Required</h3>
                                    <p className="text-indigo-700 mb-6 text-sm">Please upload your resume to generate your portfolio data.</p>
                                    <a href="/dashboard/resume" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">
                                        Go to Resume Upload
                                    </a>
                                </div>
                            ) : (
                                <div className="max-w-md text-center p-6 bg-red-50 rounded-xl border border-red-100">
                                    <p className="text-red-600 font-medium mb-2">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-sm text-red-700 underline hover:text-red-800"
                                    >
                                        Reload Page
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : editedData ? (
                        <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300 key={currentStep}">
                            {currentStepConfig.id === 'hero' && (
                                <HeroEditor data={editedData.hero} onChange={(d) => handleUpdate('hero', d)} />
                            )}
                            {currentStepConfig.id === 'tech_stack' && (
                                <TechStackEditor data={editedData.tech_stack} onChange={(d) => handleUpdate('tech_stack', d)} />
                            )}
                            {currentStepConfig.id === 'experience' && (
                                <ExperienceEditor data={editedData.experience} onChange={(d) => handleUpdate('experience', d)} />
                            )}
                            {currentStepConfig.id === 'projects' && (
                                <ProjectsEditor data={editedData.projects} onChange={(d) => handleUpdate('projects', d)} />
                            )}
                            {currentStepConfig.id === 'about' && (
                                <AboutEditor data={editedData.about} onChange={(d) => handleUpdate('about', d)} />
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

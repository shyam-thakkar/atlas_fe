import React, { useState, useEffect } from 'react';
import { StructuredPortfolio, ExperienceItem, ProjectItem, HeroSection, AboutSection } from '@/types/portfolio';
import { profile } from '@/lib/profile';
import { HeroEditor } from './portfolio/editors/HeroEditor';
import { TechStackEditor } from './portfolio/editors/TechStackEditor';
import { ExperienceEditor } from './portfolio/editors/ExperienceEditor';
import { ProjectsEditor } from './portfolio/editors/ProjectsEditor';
import { AboutEditor } from './portfolio/editors/AboutEditor';
import { PortfolioPreview } from './portfolio/PortfolioPreview';

interface PortfolioReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { id: 'hero', title: 'Start with the Basics', description: 'Introduce yourself with a punchy headline and bio.' },
    { id: 'tech_stack', title: 'Your Arsenal', description: 'List the technologies and tools you excel at.' },
    { id: 'experience', title: 'Professional Journey', description: 'Where have you worked? What did you accomplish?' },
    { id: 'projects', title: 'Key Projects', description: 'Showcase your best work and side projects.' },
    { id: 'about', title: 'The Full Story', description: 'Go into more detail about your background and philosophy.' },
];

export function PortfolioReviewModal({ isOpen, onClose }: PortfolioReviewModalProps) {
    const [data, setData] = useState<StructuredPortfolio | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch data when modal opens
    useEffect(() => {
        if (isOpen && !data) {
            setIsLoading(true);
            profile.getStructuredPortfolio()
                .then(setData)
                .catch(() => setError("Failed to load portfolio data"))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, data]);

    const handleUpdate = async (section: keyof StructuredPortfolio, newData: any) => {
        if (!data) return;

        // Optimistically update local state so the Left Panel Preview updates instantly
        setData({ ...data, [section]: newData });

        // We'll save to backend on "Next" or explicit save if we want per-change saving
        // Ideally, we passed 'newData' here.
    };

    const handleNext = async () => {
        if (!data) return;
        setIsSaving(true);
        // Save the *current* step's data to the backend before moving on
        // We know 'data' has the latest edits because the Editors call setData (via handleUpdate) on every keystroke
        const stepId = STEPS[currentStep].id as keyof StructuredPortfolio;

        try {
            await profile.updateStructuredPortfolio(stepId, data[stepId]);

            if (currentStep < STEPS.length - 1) {
                setCurrentStep(curr => curr + 1);
            } else {
                onClose(); // Finish
            }
        } catch (err) {
            console.error("Failed to save step", err);
            // Optionally show error toast
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const currentStepConfig = STEPS[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[90vw] h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300">

                {/* LEFT PANEL: PREVIEW */}
                <div className="w-[35%] bg-gray-50 border-r border-gray-200 flex flex-col h-full hidden lg:flex">
                    <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur sticky top-0 z-10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
                                <PortfolioPreview data={data} />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: EDITOR WIZARD */}
                <div className="flex-1 flex flex-col h-full bg-white relative">
                    {/* Header */}
                    <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1 block">Step {currentStep + 1} of {STEPS.length}</span>
                            <h2 className="text-2xl font-bold text-gray-900">{currentStepConfig.title}</h2>
                            <p className="text-gray-500 mt-1">{currentStepConfig.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-gray-100 w-full">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>

                    {/* Editor Content Area */}
                    <div className="flex-1 overflow-y-auto p-10 bg-white">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                    <span className="text-gray-500 font-medium">Loading your portfolio...</span>
                                </div>
                            </div>
                        ) : data ? (
                            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 key={currentStep}"> {/* Key forces re-mount anim */}
                                {currentStepConfig.id === 'hero' && (
                                    <HeroEditor data={data.hero} onChange={(d) => handleUpdate('hero', d)} />
                                )}
                                {currentStepConfig.id === 'tech_stack' && (
                                    <TechStackEditor data={data.tech_stack} onChange={(d) => handleUpdate('tech_stack', d)} />
                                )}
                                {currentStepConfig.id === 'experience' && (
                                    <ExperienceEditor data={data.experience} onChange={(d) => handleUpdate('experience', d)} />
                                )}
                                {currentStepConfig.id === 'projects' && (
                                    <ProjectsEditor data={data.projects} onChange={(d) => handleUpdate('projects', d)} />
                                )}
                                {currentStepConfig.id === 'about' && (
                                    <AboutEditor data={data.about} onChange={(d) => handleUpdate('about', d)} />
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Footer / Navigation */}
                    <div className="px-10 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentStep(c => Math.max(0, c - 1))}
                            disabled={currentStep === 0 || isSaving}
                            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${currentStep === 0
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                        >
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={isSaving}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : currentStep === STEPS.length - 1 ? (
                                <>Finish & Review <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></>
                            ) : (
                                <>Next Step <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

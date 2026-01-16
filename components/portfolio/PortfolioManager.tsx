import React, { useState, useEffect } from 'react';
import { StructuredPortfolio } from '@/types/portfolio';
import { profile } from '@/lib/profile';
import { HeroEditor } from './editors/HeroEditor';
import { SocialsEditor } from './editors/SocialsEditor';
import { TechStackEditor } from './editors/TechStackEditor';
import { ExperienceEditor } from './editors/ExperienceEditor';
import { EducationEditor } from './editors/EducationEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { AboutEditor } from './editors/AboutEditor';
import { ContactEditor } from './editors/ContactEditor';
import { PublishModal } from './PublishModal';
import { PublishButton } from './PublishStatusBadge';
import { CHAT_CONFIG } from '@/lib/chat-config';
import { Brain, X, Loader2, CheckCircle2 } from 'lucide-react';

interface PortfolioManagerProps {
    onFinish?: () => void;
    isModal?: boolean;
    onDataChange?: (data: StructuredPortfolio | null) => void;
    defaultEdit?: boolean;
}

const STEPS = [
    { id: 'hero', title: 'Hero Section', description: 'Your name, headline, and profile image.' },
    { id: 'about', title: 'Bio & Overview', description: 'Your professional introduction with tech badges.' },
    { id: 'socials', title: 'Social Links', description: 'Your social media profiles and contact information.' },
    { id: 'tech_stack', title: 'Tech Stack', description: 'The technologies and tools you excel at.' },
    { id: 'experience', title: 'Experience', description: 'Where have you worked? What did you accomplish?' },
    { id: 'projects', title: 'Projects', description: 'Showcase your best work and side projects.' },
    { id: 'education', title: 'Education', description: 'Your academic background and qualifications.' },
    { id: 'contact', title: 'Connect', description: 'Customize your contact section message.' },
];

export function PortfolioManager({ onFinish, isModal = false, onDataChange, defaultEdit = false }: PortfolioManagerProps) {
    const [data, setData] = useState<StructuredPortfolio | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(defaultEdit);
    const [editedData, setEditedData] = useState<StructuredPortfolio | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEditHint, setShowEditHint] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    // RAG rebuild state
    const [showChatbotUpdate, setShowChatbotUpdate] = useState(false);
    const [isRebuildingRAG, setIsRebuildingRAG] = useState(false);
    const [ragRebuildSuccess, setRagRebuildSuccess] = useState(false);

    // Handle click on content when not editing - show hint notification
    const handleContentClick = () => {
        if (!isEditing && editedData) {
            setShowEditHint(true);
            setTimeout(() => setShowEditHint(false), 3000);
        }
    };

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange(editedData);
        }
    }, [editedData, onDataChange]);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        profile.getStructuredPortfolio()
            .then(data => {
                setData(data);
                setEditedData(data); // Initialize edited data
            })
            .catch((err) => {
                if (err.message?.includes('409') || err.status === 409) {
                    setError("Processing not finished. Please wait for the analysis to complete.");
                } else if (err.status === 404) {
                    setError("No resume found. Please upload a resume first to generate your portfolio.");
                } else {
                    // Only log unexpected errors
                    console.error("Failed to load portfolio", err);
                    setError("Failed to load portfolio data. Please try again.");
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleUpdate = (section: keyof StructuredPortfolio, newData: any) => {
        if (!editedData) return;
        const updated = { ...editedData, [section]: newData };
        setEditedData(updated);
    };

    // Trigger RAG rebuild to update chatbot knowledge
    const handleRebuildRAG = async () => {
        setIsRebuildingRAG(true);
        setRagRebuildSuccess(false);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(CHAT_CONFIG.RAG_REBUILD_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setRagRebuildSuccess(true);
                setTimeout(() => {
                    setShowChatbotUpdate(false);
                    setRagRebuildSuccess(false);
                }, 2000);
            } else {
                console.error('Failed to rebuild RAG');
            }
        } catch (err) {
            console.error('Failed to rebuild RAG:', err);
        } finally {
            setIsRebuildingRAG(false);
        }
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

            // Show chatbot update notification after successful save
            setShowChatbotUpdate(true);

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
        ? "bg-white dark:bg-zinc-950 w-full max-w-[90vw] h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300"
        : "w-full h-full flex p-4 gap-0 bg-gray-100 dark:bg-zinc-900";

    return (
        <div className={containerInfoClass}>
            {/* LEFT: Diary-style Tabs with Actions */}
            <div className="w-52 flex-shrink-0 flex flex-col overflow-visible rounded-l-2xl bg-gray-200 dark:bg-zinc-800">
                {/* Action Buttons at Top */}
                <div className="p-3 border-b border-gray-300 dark:border-zinc-700 flex flex-col gap-2 transition-all duration-300">
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <button
                                onClick={toggleEdit}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-600 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all shadow-sm"
                            >
                                Edit
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={toggleEdit}
                                    className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-600 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Saving...' : 'Save All'}
                                </button>
                            </>
                        )}
                    </div>
                    {/* Publish Button */}
                    <PublishButton
                        onClick={() => setIsPublishModalOpen(true)}
                        className="w-full justify-center"
                    />
                </div>

                {/* Section Tabs - Diary Style */}
                <div className="flex-1 overflow-y-auto py-3 flex flex-col">
                    {STEPS.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            className={`relative text-left font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] 
                                before:absolute before:bottom-full before:right-0 before:h-5 before:w-5 before:content-[""] before:transition-opacity before:duration-300
                                after:absolute after:top-full after:right-0 after:h-5 after:w-5 after:content-[""] after:transition-opacity after:duration-300
                                before:bg-[radial-gradient(circle_at_0_0,transparent_1.25rem,white_1.25rem)] dark:before:bg-[radial-gradient(circle_at_0_0,transparent_1.25rem,#18181b_1.25rem)]
                                after:bg-[radial-gradient(circle_at_0_100%,transparent_1.25rem,white_1.25rem)] dark:after:bg-[radial-gradient(circle_at_0_100%,transparent_1.25rem,#18181b_1.25rem)]
                                ${currentStep === index
                                    ? `
                                    bg-white dark:bg-zinc-950 
                                    text-violet-600 dark:text-violet-400 
                                    font-bold text-lg py-5 px-4
                                    ml-2 rounded-l-2xl rounded-r-none 
                                    translate-x-[1px] z-20 shadow-lg
                                    before:opacity-100 after:opacity-100
                                  `
                                    : `
                                    text-gray-600 dark:text-zinc-400 
                                    hover:text-gray-800 dark:hover:text-zinc-200 
                                    hover:bg-gray-300/50 dark:hover:bg-zinc-700/50 
                                    mx-2 py-3 px-4 rounded-lg text-sm
                                    before:opacity-0 after:opacity-0
                                  `
                                }`}
                        >
                            {step.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: Content Area - Connected to selected tab */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 relative min-w-0 rounded-r-2xl shadow-xl">
                {/* Edit Hint Toast - appears on click when in review mode */}
                <div className={`absolute top-4 right-4 z-20 transition-all duration-300 ease-out ${showEditHint
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                    <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 dark:bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-violet-400 dark:text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium">To edit details, please click the <strong>Edit</strong> button</span>
                    </div>
                </div>

                {/* Editor Content Area */}
                <div
                    className="flex-1 overflow-y-auto p-6"
                    onClick={handleContentClick}
                >
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-600/20 border-t-violet-600"></div>
                                <span className="text-gray-500 dark:text-zinc-400 font-medium text-sm">Loading your portfolio...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center">
                            {error.includes('resume') ? (
                                <div className="max-w-md text-center p-8 bg-indigo-50 dark:bg-zinc-900 rounded-2xl border border-indigo-100 dark:border-zinc-700">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">Resume Required</h3>
                                    <p className="text-indigo-700 dark:text-zinc-400 mb-6 text-sm">Please upload your resume to generate your portfolio data.</p>
                                    <a href="/dashboard/resume" className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm cursor-pointer">
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
                        <div className={`w-full animate-in fade-in slide-in-from-right-4 duration-300 ${!isEditing ? 'pointer-events-none' : ''}`} key={currentStep}>
                            {currentStepConfig.id === 'hero' && (
                                <HeroEditor data={editedData.hero} onChange={(d) => handleUpdate('hero', d)} />
                            )}
                            {currentStepConfig.id === 'about' && (
                                <AboutEditor data={editedData.about} onChange={(d) => handleUpdate('about', d)} />
                            )}
                            {currentStepConfig.id === 'socials' && (
                                <SocialsEditor data={editedData.socials} onChange={(d) => handleUpdate('socials', d)} />
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
                            {currentStepConfig.id === 'education' && (
                                <EducationEditor data={editedData.education} onChange={(d) => handleUpdate('education', d)} />
                            )}
                            {currentStepConfig.id === 'contact' && (
                                <ContactEditor data={editedData.contact} onChange={(d) => handleUpdate('contact', d)} />
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Publish Modal */}
            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onSuccess={() => {
                    // Optionally refresh status or show notification
                }}
            />
        </div>
    );
}

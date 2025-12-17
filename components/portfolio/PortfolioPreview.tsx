import React from 'react';
import { StructuredPortfolio } from '@/types/portfolio';

interface PortfolioPreviewProps {
    data: StructuredPortfolio | null;
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
    if (!data) return <div className="p-8 text-center text-gray-400">No data available</div>;

    return (
        <div className="space-y-8">
            {/* Hero */}
            <section>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.hero.full_name || 'Your Name'}</h1>
                <p className="text-lg text-indigo-600 font-medium mb-4">{data.hero.headline || 'Your Headline'}</p>
                <p className="text-gray-600 leading-relaxed text-sm">{data.hero.short_bio}</p>
            </section>

            <hr className="border-gray-100" />

            {/* Tech Stack */}
            <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {data.tech_stack.length > 0 ? data.tech_stack.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                            {t}
                        </span>
                    )) : <span className="text-gray-400 text-sm">No skills listed</span>}
                </div>
            </section>

             <hr className="border-gray-100" />

            {/* Experience */}
            <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Experience</h3>
                <div className="space-y-6">
                    {data.experience.length > 0 ? data.experience.map((exp, i) => (
                        <div key={i} className="relative pl-4 border-l-2 border-gray-200">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500"></div>
                            <h4 className="font-semibold text-gray-900 text-sm">{exp.role}</h4>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-xs font-medium text-indigo-600">{exp.company}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">{exp.start_date} - {exp.end_date || 'Present'}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-3">{exp.summary}</p>
                        </div>
                    )) : <span className="text-gray-400 text-sm">No experience listed</span>}
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Projects */}
             <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Projects</h3>
                <div className="space-y-4">
                    {data.projects.length > 0 ? data.projects.map((proj, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{proj.name}</h4>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">{proj.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {proj.technologies?.slice(0, 3).map((t, j) => (
                                    <span key={j} className="text-[10px] px-1.5 py-0.5 bg-white border border-gray-200 text-gray-400 rounded">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )) : <span className="text-gray-400 text-sm">No projects listed</span>}
                </div>
            </section>
        </div>
    );
}

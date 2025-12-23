'use client';

import React from 'react';
import { FileUp, Cpu, LayoutTemplate, SquareArrowOutUpRight } from 'lucide-react';

const steps = [
    {
        title: "Upload Resume",
        description: "Drop your PDF or DOCX file. Our AI instantly starts digging into your experience.",
        icon: FileUp,
        color: "from-blue-500 to-indigo-500"
    },
    {
        title: "AI Analysis",
        description: "We extract skills, metrics, and achievements to create a structured professional profile.",
        icon: Cpu,
        color: "from-violet-500 to-purple-500"
    },
    {
        title: "Customize & Edit",
        description: "Use our live editor to fine-tune your content and choose your favorite design template.",
        icon: LayoutTemplate,
        color: "from-emerald-500 to-teal-500"
    },
    {
        title: "Go Live",
        description: "Publish your portfolio to a custom URL and start sharing it with the world.",
        icon: SquareArrowOutUpRight,
        color: "from-rose-500 to-pink-500"
    }
];

export function LandingHowItWorks() {
    return (
        <section id="how-it-works" className="py-6 bg-gray-50 dark:bg-zinc-900/40 relative overflow-hidden">
            {/* Decorative Background Line */}
            <div className="absolute top-[60%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent hidden lg:block" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <h2 className="text-sm font-bold text-violet-600 dark:text-violet-400 tracking-[0.2em] uppercase">
                        The Process
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        From PDF to <span className="italic">Portfolio</span> in 4 steps.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center group">
                            {/* Connection Arrow (Mobile only) */}
                            {idx < steps.length - 1 && (
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:hidden">
                                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-zinc-800" />
                                </div>
                            )}

                            {/* Step Number */}
                            <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-center text-xs font-bold text-gray-400 dark:text-zinc-500 z-10">
                                0{idx + 1}
                            </div>

                            {/* Icon Box */}
                            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} p-0.5 shadow-xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 mb-8`}>
                                <div className="w-full h-full rounded-[1.4rem] bg-white dark:bg-zinc-950 flex items-center justify-center">
                                    <step.icon className="w-8 h-8 text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                                {step.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 pt-10 border-t border-gray-200/50 dark:border-zinc-800/50 flex flex-col items-center">
                    <div className="p-1 px-1.5 rounded-full bg-violet-600/10 dark:bg-violet-500/10 border border-violet-600/20 dark:border-violet-500/20 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-gray-300 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold overflow-hidden`}>
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-violet-700 dark:text-violet-400 pr-2">
                            Joined by 2,000+ professionals worldwide
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

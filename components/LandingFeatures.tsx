'use client';

import React from 'react';
import {
    Brain,
    Zap,
    Palette,
    Share2,
    Globe,
    Layout,
    FileText,
    Sparkles
} from 'lucide-react';

const features = [
    {
        title: "AI Resume Analysis",
        description: "Our LLMs extract key achievements and skills from your PDF/DOCX to highlight your best work.",
        icon: Brain,
        color: "text-violet-600",
        bg: "bg-violet-50 dark:bg-violet-500/10"
    },
    {
        title: "Instant One-Click Portfolios",
        description: "Get a professional, interactive portfolio site ready to share within seconds of uploading.",
        icon: Zap,
        color: "text-amber-600",
        bg: "bg-amber-50 dark:bg-amber-500/10"
    },
    {
        title: "Premium Templates",
        description: "Choose from curated, high-end designs optimized for performance and visual impact.",
        icon: Palette,
        color: "text-emerald-600",
        bg: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
        title: "Live Split Editor",
        description: "Customize your content and see changes in real-time with our intuitive dashboard editor.",
        icon: Layout,
        color: "text-indigo-600",
        bg: "bg-indigo-50 dark:bg-indigo-500/10"
    },
    {
        title: "SEO Optimized",
        description: "Your portfolio is built for speed and searchability, helping recruiters find you easily.",
        icon: Globe,
        color: "text-cyan-600",
        bg: "bg-cyan-50 dark:bg-cyan-500/10"
    },
    {
        title: "Global Sharing",
        description: "Share your professional story with a custom link that looks perfect on any device.",
        icon: Share2,
        color: "text-rose-600",
        bg: "bg-rose-50 dark:bg-rose-500/10"
    }
];

export function LandingFeatures() {
    return (
        <section id="features" className="py-12 bg-gray-50 dark:bg-zinc-900/30 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                    <h2 className="text-sm font-bold text-violet-600 dark:text-violet-400 tracking-[0.2em] uppercase">
                        Product Features
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                        Everything you need to <span className="italic">stand out</span> from the crowd.
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-zinc-400">
                        Stop wasting hours on CSS and layouts. Let AIFolio handle the design while you focus on your career.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl hover:border-violet-500/50 dark:hover:border-violet-500/30 hover:shadow-xl dark:hover:shadow-violet-500/5 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h4>
                            <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

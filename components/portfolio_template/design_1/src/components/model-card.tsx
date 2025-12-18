"use client";

import { memo } from "react";
import { Brain, Code2, Database, Zap, Target, Wrench } from "lucide-react";

const CAPABILITIES_DATA = [
    {
        title: "LLM Application Engineering",
        description: "LangChain, LangGraph, agent architectures, custom tools, memory systems"
    },
    {
        title: "Backend Systems Development",
        description: "Django, FastAPI, microservices, event-driven systems"
    },
    {
        title: "Data Processing & Pipelines",
        description: "ETL systems, embeddings, vector stores, retrieval pipelines"
    },
    {
        title: "Real-Time Intelligence",
        description: "WebSockets, async systems, live state updates"
    },
    {
        title: "AI-Driven Automation",
        description: "workflow optimization, intelligent assistants, business automation"
    },
] as const;

const STRENGTHS_DATA = [
    "Production-grade engineering mindset",
    "Ability to design scalable GenAI architectures",
    "Strong debugging and problem-solving intuition",
    "Converts ambiguous ideas into structured, actionable systems",
    "Rapid prototype → deploy cycle",
] as const;

const TECH_STACK_DATA = [
    { category: "Backend", tech: "Python, Django, FastAPI" },
    { category: "GenAI", tech: "LangChain, LangGraph, OpenAI/DeepSeek APIs" },
    { category: "Infra", tech: "Docker, Linux, Redis, Postgres" },
    { category: "Frontend", tech: "Next.js, Tailwind, ShadCN" },
] as const;

const PERFORMANCE_DATA = [
    "Robust system design under ambiguity",
    "Efficient async workflows (high throughput)",
    "LLM agent orchestration with deterministic flows",
    "Enterprise-ready scalability",
] as const;

const USE_CASES = [
    "AI automation",
    "LLM-powered applications",
    "Knowledge agents",
    "Conversation intelligence",
    "Inspection/Operations automation",
] as const;

const CapabilityItem = memo(function CapabilityItem({
    title,
    description
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                {title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {description}
            </p>
        </div>
    );
});

const StrengthItem = memo(function StrengthItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="text-zinc-400 dark:text-zinc-600 mt-1" aria-hidden="true">▸</span>
            <span>{text}</span>
        </li>
    );
});

const TechRow = memo(function TechRow({ category, tech }: { category: string; tech: string }) {
    return (
        <tr>
            <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-50">
                {category}
            </td>
            <td className="py-2 px-3 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                {tech}
            </td>
        </tr>
    );
});

const UseCaseBadge = memo(function UseCaseBadge({ text }: { text: string }) {
    return (
        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-md border border-zinc-200 dark:border-zinc-700">
            {text}
        </span>
    );
});

export const ModelCard = memo(function ModelCard() {
    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        SHYAM-DEV-1
                    </h1>
                    <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md font-mono">
                        v1.0.0
                    </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    A production-ready GenAI Engineer optimized for building intelligent applications.
                </p>
            </div>

            {/* Model Overview */}
            <section className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                        Model Overview
                    </h2>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    SHYAM-DEV-1 is a full-stack GenAI engineering model specializing in designing,
                    implementing, and deploying intelligent systems. Purpose-built to transform complex
                    requirements into scalable backend architectures and high-performance LLM-powered applications.
                </p>
            </section>

            {/* Core Capabilities */}
            <section className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                        Core Capabilities
                    </h2>
                </div>
                <div className="space-y-3">
                    {CAPABILITIES_DATA.map((capability) => (
                        <CapabilityItem
                            key={capability.title}
                            title={capability.title}
                            description={capability.description}
                        />
                    ))}
                </div>
            </section>

            {/* Key Strengths */}
            <section className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                        Key Strengths
                    </h2>
                </div>
                <ul className="space-y-2">
                    {STRENGTHS_DATA.map((strength) => (
                        <StrengthItem key={strength} text={strength} />
                    ))}
                </ul>
            </section>

            {/* Tech Stack */}
            <section className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                        Tech Stack Version
                    </h2>
                </div>
                <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                                <th className="text-left py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-50">
                                    Category
                                </th>
                                <th className="text-left py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-50">
                                    Technologies
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {TECH_STACK_DATA.map((row) => (
                                <TechRow key={row.category} category={row.category} tech={row.tech} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Performance Highlights */}
            <section className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                        Performance Highlights
                    </h2>
                </div>
                <ul className="space-y-2">
                    {PERFORMANCE_DATA.map((item) => (
                        <StrengthItem key={item} text={item} />
                    ))}
                </ul>
            </section>

            {/* Intended Use */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                        Intended Use
                    </h2>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    For organizations seeking:
                </p>
                <div className="flex flex-wrap gap-2">
                    {USE_CASES.map((useCase) => (
                        <UseCaseBadge key={useCase} text={useCase} />
                    ))}
                </div>
            </section>
        </div>
    );
});


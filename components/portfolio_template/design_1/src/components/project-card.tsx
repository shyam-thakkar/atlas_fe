"use client";

import { memo } from "react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { TechStack, TechItem } from "./tech-stack";

export interface ProjectData {
    title: string;
    description: string;
    image?: string;
    tags: string[];
    techStack?: TechItem[];
    liveUrl?: string;
    githubUrl?: string;
    variant?: "card" | "minimal" | "featured";
}

interface ProjectCardProps {
    project: ProjectData;
    onClick?: () => void;
}

const STYLES = {
    card: {
        container: "relative bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full",
        image: "relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden",
        content: "p-4 flex flex-col flex-grow h-full",
        title: "text-xl font-bold text-black dark:text-white mb-2 h-14 line-clamp-2",
        description: "text-sm text-zinc-600 dark:text-zinc-400 mb-4 h-[60px] line-clamp-3",
        link: "flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors",
    },
    minimal: {
        container: "group border-l-4 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white pl-4 py-2 transition-all duration-300",
        title: "text-lg font-bold text-black dark:text-white group-hover:underline",
        description: "text-sm text-zinc-600 dark:text-zinc-400 mb-3",
        tag: "text-xs text-zinc-500 dark:text-zinc-500",
        iconLink: "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors",
    },
    featured: {
        container: "group relative bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-xl",
        image: "relative h-64 md:h-auto md:w-1/2 bg-zinc-200 dark:bg-zinc-800 overflow-hidden",
        content: "p-8 md:w-1/2 flex flex-col justify-center",
        badge: "inline-block px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full mb-4 w-fit",
        title: "text-2xl font-bold text-black dark:text-white mb-3",
        description: "text-base text-zinc-600 dark:text-zinc-400 mb-6",
        tag: "px-3 py-1 text-sm font-medium bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-700",
        primaryButton: "flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-80 transition-opacity",
        secondaryButton: "flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-white text-black dark:text-white font-medium rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors",
    },
} as const;

export const ProjectCard = memo(function ProjectCard({ project, onClick }: ProjectCardProps) {
    const variant = project.variant || "card";

    if (variant === "card") {
        return (
            <div
                className={STYLES.card.container}
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
                aria-label={`View details for ${project.title}`}
            >
                {project.image && (
                    <div className={STYLES.card.image}>
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className={STYLES.card.content}>
                    <h3 className={STYLES.card.title}>
                        {project.title}
                    </h3>
                    <p className={STYLES.card.description}>
                        {project.description}
                    </p>

                    {project.techStack && project.techStack.length > 0 ? (
                        <div className="mb-4 min-h-16">
                            <TechStack items={project.techStack.slice(0, 6)} maxCols={8} />
                        </div>
                    ) : (
                        <div className="mb-4 min-h-16" />
                    )}

                    <div className="flex gap-3 mt-auto">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={STYLES.card.link}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`View live demo of ${project.title}`}
                            >
                                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                Live Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={STYLES.card.link}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`View source code for ${project.title}`}
                            >
                                <Github className="w-4 h-4" aria-hidden="true" />
                                Code
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "minimal") {
        return (
            <div className={STYLES.minimal.container}>
                <div className="flex items-start justify-between mb-2">
                    <h3 className={STYLES.minimal.title}>
                        {project.title}
                    </h3>
                    <div className="flex gap-2">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={STYLES.minimal.iconLink}
                                aria-label={`View live demo of ${project.title}`}
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={STYLES.minimal.iconLink}
                                aria-label={`View source code for ${project.title}`}
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
                <p className={STYLES.minimal.description}>
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className={STYLES.minimal.tag}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === "featured") {
        return (
            <div className={STYLES.featured.container}>
                <div className="flex flex-col md:flex-row">
                    {project.image && (
                        <div className={STYLES.featured.image}>
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>
                    )}

                    <div className={STYLES.featured.content}>
                        <div className={STYLES.featured.badge}>
                            FEATURED
                        </div>
                        <h3 className={STYLES.featured.title}>
                            {project.title}
                        </h3>
                        <p className={STYLES.featured.description}>
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className={STYLES.featured.tag}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={STYLES.featured.primaryButton}
                                    aria-label={`View ${project.title} project`}
                                >
                                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                    View Project
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={STYLES.featured.secondaryButton}
                                    aria-label={`View source code for ${project.title}`}
                                >
                                    <Github className="w-4 h-4" aria-hidden="true" />
                                    Source Code
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
});


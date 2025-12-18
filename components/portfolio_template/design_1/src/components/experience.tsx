"use client";

import { useMemo } from "react";
import { Calendar, Briefcase } from "lucide-react";
import Image from "next/image";
import { EXPERIENCES_DATA } from "../constants/experience-data";

// Constants
const LOGO_SIZES = {
  small: { width: 60, height: 40, className: "object-contain h-5 w-auto" },
  medium: { width: 60, height: 60, className: "object-contain h-10 w-auto" },
} as const;

const TIMELINE_STYLES = {
  dot: "absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-4 border-zinc-400 dark:border-zinc-600",
  line: "relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 md:ml-6 space-y-12",
  bullet: "mt-2 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0",
} as const;

export function Experience() {
  // Memoize experiences to prevent recreation on every render
  const experiences = useMemo(() => EXPERIENCES_DATA, []);

  return (
    <section className="py-2">
      <h2 className="text-3xl font-bold text-black dark:text-white mb-8 flex items-center gap-3">
        <Briefcase className="w-8 h-8" aria-hidden="true" />
        Experience
      </h2>
      <div className={TIMELINE_STYLES.line}>
        {experiences.map((job) => (
          <article key={job.id} className="relative pl-8 md:pl-12">
            {/* Timeline dot */}
            <div className={TIMELINE_STYLES.dot} aria-hidden="true" />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={job.logoSrc}
                    alt={`${job.company} logo`}
                    width={LOGO_SIZES[job.logoSize].width}
                    height={LOGO_SIZES[job.logoSize].height}
                    className={LOGO_SIZES[job.logoSize].className}
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {job.company}
                  </h3>
                  <p className="text-lg text-zinc-700 dark:text-zinc-300 font-medium">
                    {job.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-0 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full w-fit self-start sm:self-center">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <time>{job.period}</time>
              </div>
            </div>

            <ul className="space-y-3">
              {job.description.map((item, i) => (
                <li
                  key={`${job.id}-desc-${i}`}
                  className="text-zinc-600 dark:text-zinc-400 leading-relaxed flex items-start gap-2"
                >
                  <span className={TIMELINE_STYLES.bullet} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

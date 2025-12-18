"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { ModelCard } from "@/components/model-card";
import { StatsCard } from "@/components/stats-card";
import { TechBadge } from "@/components/tech-badge";
import { SocialLinks } from "@/components/social-links";
import { TechStack } from "@/components/tech-stack";
import { ProjectCard } from "@/components/project-card";
import { ProjectDetail, ProjectDetailData } from "@/components/project-detail";
import { Experience } from "@/components/experience";
import { TypingAnimation } from "@/components/typing-animation";
import { ContactSection } from "@/components/contact-section";
import { PROJECT_DETAILS } from "@/constants/project-data";
import { PERSONAL_INFO } from "@/constants/personal-info";
import { TECH_STACK_ITEMS } from "@/constants/tech-stack-data";
import { SOCIAL_LINKS } from "@/constants/social-links";
import { DESCRIPTION_TECH_BADGES } from "@/constants/tech-badges";
import { EDUCATION_DATA } from "@/constants/education-data";


export default function Home() {
  const [view, setView] = useState<'main' | 'model-card'>('main');
  const [selectedProject, setSelectedProject] = useState<ProjectDetailData | null>(null);

  const projectDetails = useMemo(() => PROJECT_DETAILS, []);

  const openProjectDetail = useCallback((projectKey: string) => {
    const detail = projectDetails[projectKey];
    if (detail) {
      setSelectedProject(detail);
    }
  }, [projectDetails]);

  const handleViewChange = useCallback(() => setView('main'), []);
  const handleStatsClick = useCallback(() => setView('model-card'), []);
  const handleCloseProject = useCallback(() => setSelectedProject(null), []);


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      {/* Sticky Header with Backdrop Blur */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 shadow-lg">
        <div className="mx-auto w-full md:w-[50%] px-4 md:px-8 py-4 md:border-l-2 md:border-r-2 border-b-2 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            {/* Profile Section - Clickable */}
            <div
              className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleViewChange}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleViewChange()}
              aria-label="Return to main view"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 shadow-sm">
                <Image
                  src={PERSONAL_INFO.profileImage}
                  alt="Profile"
                  width={800}
                  height={800}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white leading-tight">
                  {PERSONAL_INFO.name}
                </h2>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  {PERSONAL_INFO.title}
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content Container with Vertical Borders */}
      <main className="mx-auto w-full md:w-[50%] min-h-screen px-4 md:px-8 py-6 md:border-l-2 md:border-r-2 border-zinc-200 dark:border-zinc-800">
        {view === 'main' ? (
          <>
            {/* Hero Section */}
            <section className="py-2">
              <div className="flex gap-8 items-center ">
                {/* Left: Profile Photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 shadow-md">
                    <Image
                      src={PERSONAL_INFO.profileImage}
                      alt="Profile"
                      width={800}
                      height={800}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>

                </div>
                <StatsCard onClick={handleStatsClick} />

                {/* Right: Description */}

              </div>
              <div className="mt-6">
                {/* Greeting - Larger and Brighter */}
                <div className="flex flex-wrap items-baseline gap-2 mb-4">
                  <p className="text-3xl font-bold text-black dark:text-white">
                    {PERSONAL_INFO.greeting}
                  </p>
                  <p className="text-3xl font text-zinc-400 dark:text-zinc-400 font-heading">
                    - <TypingAnimation text={PERSONAL_INFO.typingText} speed={100} delay={500} />
                  </p>
                </div>
                {/* Description */}
                <div className="text-lg leading-loose text-zinc-600 dark:text-zinc-400 mb-6">
                  {PERSONAL_INFO.description}
                  <TechBadge {...DESCRIPTION_TECH_BADGES[0]} />
                  with
                  <TechBadge {...DESCRIPTION_TECH_BADGES[1]} />
                  and
                  <TechBadge {...DESCRIPTION_TECH_BADGES[2]} />
                  {PERSONAL_INFO.descriptionContinued}
                  <TechBadge {...DESCRIPTION_TECH_BADGES[3]} />
                  and
                  <TechBadge {...DESCRIPTION_TECH_BADGES[4]} />
                  {PERSONAL_INFO.descriptionEnd}
                </div>

                {/* Social Media Links & Resume */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <SocialLinks
                    links={SOCIAL_LINKS}
                  />
                </div>
              </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-4">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                Tech Stack
              </h2>
              <TechStack items={TECH_STACK_ITEMS} />
            </section>

            {/* Projects Section */}
            <section className="py-4">
              {/* Experience Section */}
              <Experience />

              <h2 className="text-3xl font-bold text-black dark:text-white mb-6 mt-6">
                Projects
              </h2>

              {/* All Projects - Card Style Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectCard
                  project={{
                    title: projectDetails["karate-kata"].title,
                    description: projectDetails["karate-kata"].description,
                    image: projectDetails["karate-kata"].image,
                    tags: projectDetails["karate-kata"].tags,
                    techStack: projectDetails["karate-kata"].techStack,
                    liveUrl: projectDetails["karate-kata"].liveUrl,
                    githubUrl: projectDetails["karate-kata"].githubUrl,
                    variant: "card"
                  }}
                  onClick={() => openProjectDetail("karate-kata")}
                />
                <ProjectCard
                  project={{
                    title: projectDetails["stock-prediction"].title,
                    description: projectDetails["stock-prediction"].description,
                    image: projectDetails["stock-prediction"].image,
                    tags: projectDetails["stock-prediction"].tags,
                    techStack: projectDetails["stock-prediction"].techStack,
                    liveUrl: projectDetails["stock-prediction"].liveUrl,
                    githubUrl: projectDetails["stock-prediction"].githubUrl,
                    variant: "card"
                  }}
                  onClick={() => openProjectDetail("stock-prediction")}
                />
              </div>
            </section>

            {/* Education Section */}
            <section className="py-2">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                Education
              </h2>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {EDUCATION_DATA.institution}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {EDUCATION_DATA.degree}
                    </p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      CGPA: {EDUCATION_DATA.cgpa}
                    </span>
                    <span className="block text-sm text-zinc-500 dark:text-zinc-500">
                      {EDUCATION_DATA.duration}
                    </span>
                  </div>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {EDUCATION_DATA.location}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <ContactSection />

            {/* Spacer for Chat Button */}
            <div className="h-6" />
          </>
        ) : (
          /* Model Card View */
          <section className="py-6">
            <ModelCard />
          </section>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={handleCloseProject}
        />
      )}
    </div>
  );
}

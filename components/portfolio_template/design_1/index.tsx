"use client";

import { useState, useCallback, useMemo } from "react";
import { ThemeToggle } from "./src/components/theme-toggle";
import { ModelCard } from "./src/components/model-card";
import { ProjectCard } from "./src/components/project-card";
import { ProjectDetail, ProjectDetailData } from "./src/components/project-detail";
import { Experience } from "./src/components/experience";
import { TypingAnimation } from "./src/components/typing-animation";
import { ContactSection } from "./src/components/contact-section";
import { EDUCATION_DATA } from "./src/constants/education-data";
import { StructuredPortfolio } from "../../../types/portfolio";
import { SmartTechBadge } from "./src/components/smart-tech-badge";
import { TechStackIcon } from "./src/components/tech-stack-icon";
import { DynamicSocialIcon } from "./src/components/dynamic-social-icon";

interface PortfolioDesign1Props {
  data: StructuredPortfolio | null;
}

export function PortfolioDesign1({ data }: PortfolioDesign1Props) {
  const [view, setView] = useState<'main' | 'model-card'>('main');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  // Use passed data or fallbacks
  const personalInfo = useMemo(() => {
    if (!data) return null;
    return {
      name: data.hero.full_name || "Your Name",
      title: data.hero.headline || "Your Title",
      greeting: "Hey! I'm " + (data.hero.full_name || "User"),
      typingText: data.hero.headline || "Developer",
      profileImage: data.hero.profile_image || "/profile.png",
      description: data.about.long_bio || "No bio available.",
    };
  }, [data]);

  // Compute selected project detail data dynamically from current data
  const selectedProject = useMemo(() => {
    if (selectedProjectIndex === null || !data?.projects[selectedProjectIndex]) return null;

    const proj = data.projects[selectedProjectIndex];
    return {
      title: proj.title,
      description: proj.description,
      longDescription: proj.description,
      image: proj.thumbnail_url || '/project-placeholder.png',
      tags: proj.technologies || [],
      techStack: [], // TODO: map technologies to TechItem[]
      liveUrl: proj.live_url,
      githubUrl: proj.repo_url,
      features: proj.key_features || [],
      challenges: proj.technical_challenges || [],
      date: proj.year,
      team: proj.project_type,
    } as ProjectDetailData;
  }, [selectedProjectIndex, data?.projects]);

  const openProjectDetail = useCallback((index: number) => {
    setSelectedProjectIndex(index);
  }, []);

  const handleViewChange = useCallback(() => setView('main'), []);
  const handleCloseProject = useCallback(() => setSelectedProjectIndex(null), []);

  if (!data || !personalInfo) return <div className="p-10 text-center">Loading or No Data...</div>;

  const renderBioWithBadges = (text: string) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      const match = part.match(/\{\{([^}]+)\}\}/);
      if (match) {
        const codeName = match[1];
        return <SmartTechBadge key={index} codeName={codeName} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="portfolio-transition min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900 font-sans text-zinc-900 dark:text-zinc-100">
        {/* Sticky Header with Backdrop Blur */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 shadow-lg">
          <div className="mx-auto w-full md:w-[70%] px-4 md:px-8 py-4 md:border-l-2 md:border-r-2 border-b-2 border-zinc-200 dark:border-zinc-800">
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
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-transparent relative">
                  {/* Use profile image if available */}
                  {personalInfo.profileImage && personalInfo.profileImage !== "/profile.png" ? (
                    <img
                      src={personalInfo.profileImage}
                      alt={personalInfo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-500 font-bold text-xl border-2 border-zinc-300 dark:border-zinc-700">
                      {personalInfo.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white leading-tight transition-colors duration-300">
                    {personalInfo.name}
                  </h2>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium transition-colors duration-300">
                    {personalInfo.title}
                  </p>
                </div>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} />
            </div>
          </div>
        </header>

        {/* Content Container with Vertical Borders */}
        <main className="mx-auto w-full md:w-[70%] min-h-screen px-4 md:px-8 py-6 md:border-l-2 md:border-r-2 border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          {view === 'main' ? (
            <>
              {/* Hero Section */}
              <section className="py-12">
                <div className="flex gap-6 items-center mb-10">
                  {/* Left: Profile Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-transparent relative border-4 border-zinc-200 dark:border-zinc-800">
                      {personalInfo.profileImage && personalInfo.profileImage !== "/profile.png" ? (
                        <img
                          src={personalInfo.profileImage}
                          alt={personalInfo.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-500 font-bold text-5xl">
                          {personalInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Greeting and Typing Animation */}
                  <div className="flex-1">
                    {/* Greeting */}
                    <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white transition-colors duration-300 mb-3 whitespace-nowrap">
                      {personalInfo.greeting}
                    </h1>
                    {/* Typing Animation */}
                    <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-light">
                      <TypingAnimation text={personalInfo.typingText} speed={100} delay={500} />
                    </p>
                  </div>
                </div>

                <div>
                  {/* Description with Badges */}
                  <div className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-8 transition-colors duration-300">
                    {renderBioWithBadges(personalInfo.description)}
                  </div>

                  {/* Social Media Links */}
                  <div className="flex flex-wrap items-center gap-3">
                    {data.socials && Object.entries(data.socials).map(([platform, url]) => {
                      if (!url || typeof url !== 'string') return null;

                      // Handle email special case
                      const finalUrl = platform === 'email'
                        ? (url.startsWith('mailto:') ? url : `mailto:${url}`)
                        : url;

                      return (
                        <DynamicSocialIcon
                          key={platform}
                          platform={platform}
                          url={finalUrl}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Tech Stack Section */}
              <section className="py-8">
                <h2 className="text-3xl font-bold text-black dark:text-white mb-6 transition-colors duration-300">
                  Tech Stack
                </h2>
                {data.tech_stack.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {data.tech_stack.map((tech, i) => (
                      <TechStackIcon key={i} codeName={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">No tech stack added yet.</p>
                )}
              </section>

              {/* Projects Section */}
              <section className="py-8">
                {/* Experience Section */}
                <Experience data={data.experience} />

                <h2 className="text-3xl font-bold text-black dark:text-white mb-6 mt-12 transition-colors duration-300">
                  Projects
                </h2>

                {/* All Projects - Card Style Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Real Data Projects */}
                  {data.projects.map((proj, i) => (
                    <ProjectCard
                      key={i}
                      project={{
                        title: proj.title,
                        description: proj.description,
                        image: proj.thumbnail_url || undefined,
                        tags: proj.technologies || [],
                        techStack: [], // TODO: map technologies to icons
                        liveUrl: proj.live_url || undefined,
                        githubUrl: proj.repo_url || undefined,
                        variant: "card"
                      }}
                      onClick={() => openProjectDetail(i)}
                    />
                  ))}
                </div>
              </section>

              {/* Education Section */}
              <section className="py-8">
                <h2 className="text-3xl font-bold text-black dark:text-white mb-6 transition-colors duration-300">
                  Education
                </h2>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-6 shadow-sm transition-colors duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                        {EDUCATION_DATA.institution}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
                        {EDUCATION_DATA.degree}
                      </p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                        CGPA: {EDUCATION_DATA.cgpa}
                      </span>
                      <span className="block text-sm text-zinc-500 dark:text-zinc-500 transition-colors duration-300">
                        {EDUCATION_DATA.duration}
                      </span>
                    </div>
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm transition-colors duration-300">
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
    </div>
  );
}

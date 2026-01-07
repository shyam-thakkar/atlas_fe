"use client";

import { useState, useCallback, useMemo } from "react";
import { ThemeToggle } from "./src/components/theme-toggle";
import { ModelCard } from "./src/components/model-card";
import { ProjectCard } from "./src/components/project-card";
import { ProjectDetail, ProjectDetailData } from "./src/components/project-detail";
import { Experience } from "./src/components/experience";
import { TypingAnimation } from "./src/components/typing-animation";
import { ContactSection } from "./src/components/contact-section";
import { StructuredPortfolio } from "../../../types/portfolio";
import { SmartTechBadge } from "./src/components/smart-tech-badge";
import { TechStackIcon } from "./src/components/tech-stack-icon";
import { DynamicSocialIcon } from "./src/components/dynamic-social-icon";

// Base API URL for media files
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to construct proper media URL
function getMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it looks like a static asset in /public (e.g., /alex-johnson-pfp.png), return as-is
  // These are served directly by Next.js without needing the API base URL
  if (url.startsWith('/') && (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.webp') || url.includes('.svg') || url.includes('.gif'))) {
    // Check if it's a media path from API (contains /media/) or a local static asset
    if (!url.includes('/media/')) {
      return url; // Local static asset, return as-is
    }
  }
  // If relative URL starting with /, prepend API base
  if (url.startsWith('/')) {
    return `${BASE_API_URL}${url}`;
  }
  // Otherwise prepend with / and API base
  return `${BASE_API_URL}/${url}`;
}

interface PortfolioDesign1Props {
  data: StructuredPortfolio | null;
  fullWidth?: boolean; // Use full width when in iframe/preview mode
  children?: React.ReactNode; // Allow rendering chat widget inside themed container
}

export function PortfolioDesign1({ data, fullWidth = false, children }: PortfolioDesign1Props) {
  const [view, setView] = useState<'main' | 'model-card'>('main');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Compute content width class based on fullWidth prop
  const contentWidthClass = fullWidth ? 'w-full' : 'w-full md:w-[60%]';

  const handleThemeToggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    // Notify parent window about theme change (for iframe browser chrome sync)
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'PORTFOLIO_THEME_CHANGE',
        isDark: newIsDark
      }, '*');
    }
  };

  // Use passed data or fallbacks
  const personalInfo = useMemo(() => {
    if (!data) return null;
    return {
      name: data.hero.full_name || "Your Name",
      title: data.hero.headline || "Your Title",
      greeting: "Hey! I'm " + (data.hero.full_name || "User"),
      typingText: data.hero.headline || "Developer",
      profileImage: getMediaUrl(data.hero.profile_image) || "/profile.png",
      description: data.about.long_bio || "",
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
      image: getMediaUrl(proj.thumbnail_url) || undefined,
      tags: proj.technologies || [],
      techStack: [], // Using technologies array instead
      technologies: proj.technologies || [], // Pass tech code names for icon rendering
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
      <div className="portfolio-transition min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900 text-zinc-900 dark:text-zinc-100" style={{ fontFamily: '"Sora", sans-serif' }}>
        {/* Sticky Header with Backdrop Blur */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 shadow-lg">
          <div className={`mx-auto ${contentWidthClass} px-4 md:px-8 py-4 ${!fullWidth ? 'md:border-l-2 md:border-r-2' : ''} border-b-2 border-zinc-200 dark:border-zinc-800`}>
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
        <main className={`mx-auto ${contentWidthClass} px-4 md:px-8 py-6 ${!fullWidth ? 'md:border-l-2 md:border-r-2' : ''} border-zinc-200 dark:border-zinc-800 transition-colors duration-300`}>
          {view === 'main' ? (
            <>
              {/* Hero Section */}
              <section className="py-12">
                <div className="flex flex-col sm:flex-row gap-6 items-center mb-10">
                  {/* Left: Profile Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-transparent relative border-4 border-zinc-200 dark:border-zinc-800">
                      {personalInfo.profileImage && personalInfo.profileImage !== "/profile.png" ? (
                        <img
                          src={personalInfo.profileImage}
                          alt={personalInfo.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-500 font-bold text-4xl sm:text-5xl">
                          {personalInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Greeting and Typing Animation */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    {/* Greeting */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white transition-colors duration-300 mb-3 break-words">
                      {personalInfo.greeting}
                    </h1>
                    {/* Typing Animation */}
                    <p className="text-lg sm:text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-light">
                      <TypingAnimation text={personalInfo.typingText} speed={100} delay={500} />
                    </p>
                  </div>
                </div>

                <div>
                  {/* Description with Badges - only show if bio exists */}
                  {personalInfo.description && personalInfo.description.trim() && (
                    <div className="text-lg leading-loose text-zinc-600 dark:text-zinc-400 mb-8 transition-colors duration-300" style={{ lineHeight: '2.2' }}>
                      {renderBioWithBadges(personalInfo.description)}
                    </div>
                  )}

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
              {data.tech_stack.length > 0 && (
                <section className="py-8">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6 transition-colors duration-300">
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {data.tech_stack.map((tech, i) => (
                      <TechStackIcon key={i} codeName={tech} />
                    ))}
                  </div>
                </section>
              )}

              {/* Experience Section */}
              <Experience data={data.experience} />

              {/* Projects Section */}
              {data.projects && data.projects.length > 0 && (
                <section className="py-8">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6 transition-colors duration-300">
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
                          image: getMediaUrl(proj.thumbnail_url) || undefined,
                          tags: proj.technologies || [],
                          technologies: proj.technologies || [], // Pass tech code names for icon rendering
                          liveUrl: proj.live_url || undefined,
                          githubUrl: proj.repo_url || undefined,
                          variant: "card"
                        }}
                        onClick={() => openProjectDetail(i)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Education Section */}
              {data.education && data.education.length > 0 && (
                <section className="py-8">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6 transition-colors duration-300">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {data.education.map((edu, index) => {
                      // Format dates nicely - handles ISO dates, year-only, and Present
                      const formatDate = (dateStr: string) => {
                        if (!dateStr) return '';
                        if (dateStr === 'Present') return 'Present';

                        // Check if it's year-only (just 4 digits)
                        const yearOnlyMatch = dateStr.match(/^(\d{4})$/);
                        if (yearOnlyMatch) {
                          return yearOnlyMatch[1];
                        }

                        // Try ISO date format
                        const date = new Date(dateStr);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        }
                        return dateStr;
                      };

                      // Format grade type label
                      const getGradeLabel = (type?: string) => {
                        switch (type?.toLowerCase()) {
                          case 'cgpa': return 'CGPA';
                          case 'sgpa': return 'SGPA';
                          case 'gpa': return 'GPA';
                          case 'percentage': return 'Percentage';
                          default: return 'Grade';
                        }
                      };

                      return (
                        <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-6 shadow-sm transition-colors duration-300">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                                {edu.institution}
                              </h3>
                              <p className="text-zinc-600 dark:text-zinc-400 transition-colors duration-300 mt-1">
                                {edu.degree}
                                {edu.field_of_study && <span className="text-zinc-500 dark:text-zinc-500"> in {edu.field_of_study}</span>}
                              </p>
                              {edu.description && (
                                <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
                                  {edu.description}
                                </p>
                              )}
                            </div>
                            <div className="text-left md:text-right flex-shrink-0">
                              {edu.grade && (
                                <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                                  {getGradeLabel(edu.grade_type)}: {edu.grade}
                                  {edu.grade_type === 'percentage' && '%'}
                                </span>
                              )}
                              <span className="block text-sm text-zinc-500 dark:text-zinc-500 transition-colors duration-300">
                                {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Contact Section */}
              <ContactSection socials={data.socials} contact={data.contact} />
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

        {/* Render children (like ChatWidget) inside themed container */}
        {children}
      </div>
    </div>
  );
}

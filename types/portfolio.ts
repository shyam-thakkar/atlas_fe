export interface HeroSection {
    full_name: string;
    headline: string;
    short_bio: string;
}

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    email?: string;
}

export interface ExperienceItem {
    role: string;
    company: string;
    start_date: string;
    end_date: string | null;
    summary: string;
    technologies?: string[]; // The JSON didn't explicitly show this in experience items but it's good to keep optional if backend adds it, or remove if strict. The user JSON didn't show technologies in experience.
}

export interface ProjectItem {
    name: string;
    description: string;
    technologies: string[];
    github_link?: string;
    live_link?: string;
}

export interface AboutSection {
    long_bio: string;
    hobbies?: string[];
}

export interface StructuredPortfolio {
    hero: HeroSection;
    socials: SocialLinks;
    tech_stack: string[];
    experience: ExperienceItem[];
    projects: ProjectItem[];
    about: AboutSection;
}

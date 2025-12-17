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
    technologies?: string[]; 
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

export type PipelineStatusEnum = 
    | 'idle'
    | 'uploaded' 
    | 'raw_extracting' 
    | 'raw_extracted' 
    | 'structure_extracting' 
    | 'structure_extracted' 
    | 'review_required' 
    | 'completed' 
    | 'failed';

export interface PipelineStatus {
    status: PipelineStatusEnum;
    message: string;
    progress: number;
    can_review: boolean;
    can_publish: boolean;
    missing_items?: string[];
}

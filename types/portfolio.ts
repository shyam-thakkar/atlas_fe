export interface HeroSection {
    full_name: string;
    headline: string;
    short_bio: string;
    profile_image?: string;
}

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    email?: string;
    [key: string]: string | undefined; // Allow any social platform from registry
}

export interface ExperienceItem {
    role: string;
    company_name: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string;
    technologies?: string[];
    logo_url?: string | null;
}

export interface ProjectItem {
    title: string;
    description: string;
    technologies: string[];
    repo_url?: string;
    live_url?: string;
    key_features?: string[];
    technical_challenges?: string[];
    year?: string;
    project_type?: string;
    thumbnail_url?: string | null;
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

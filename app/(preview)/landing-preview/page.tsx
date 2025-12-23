'use client';

import { PortfolioDesign1 } from '@/components/portfolio_template/design_1';
import { StructuredPortfolio } from '@/types/portfolio';

// Sample portfolio data to showcase what users can create
const samplePortfolioData: StructuredPortfolio = {
    hero: {
        full_name: "Alex Johnson",
        headline: "Full Stack Developer | Cloud Architect | Open Source Contributor",
        short_bio: "Passionate developer with 5+ years of experience",
        profile_image: "/alex-johnson-pfp.png",
    },
    about: {
        long_bio: "I'm a passionate software developer specializing in building exceptional digital experiences. With expertise in {{react}}, {{typescript}}, and {{nodejs}}, I create scalable web applications that solve real-world problems. Currently focused on cloud-native development and {{aws}} architecture.",
    },
    experience: [
        {
            company_name: "TechCorp Inc.",
            role: "Senior Software Engineer",
            start_date: "2022-01",
            end_date: null,
            is_current: true,
            description: "Leading development of microservices architecture serving 1M+ users daily. Reduced API response time by 60% through optimization. Led migration to Kubernetes, improving deployment efficiency by 40%.",
            technologies: ["react", "nodejs", "aws", "kubernetes"],
            logo_url: null,
        },
        {
            company_name: "StartupXYZ",
            role: "Full Stack Developer",
            start_date: "2020-06",
            end_date: "2021-12",
            is_current: false,
            description: "Built core product features from scratch, contributing to successful Series A funding. Developed real-time collaboration features using WebSockets. Implemented CI/CD pipelines reducing deployment time by 80%.",
            technologies: ["vuejs", "python", "postgresql"],
            logo_url: null,
        }
    ],
    education: [
        {
            institution: "Stanford University",
            degree: "Master of Science",
            field_of_study: "Computer Science",
            start_date: "2018",
            end_date: "2020",
            grade: "3.9",
            grade_type: "gpa",
            description: "Focus on Distributed Systems and Machine Learning",
        }
    ],
    projects: [
        {
            title: "CloudSync Pro",
            description: "Real-time file synchronization platform with end-to-end encryption",
            technologies: ["react", "go", "aws", "webrtc"],
            key_features: ["E2E encryption", "Cross-platform sync", "Conflict resolution"],
            technical_challenges: ["Optimizing large file transfers", "Real-time sync algorithms"],
            repo_url: "https://github.com/example/cloudsync",
            live_url: "https://cloudsync.demo",
            thumbnail_url: undefined,
            year: "2023",
            project_type: "Personal",
        },
        {
            title: "DevMetrics Dashboard",
            description: "Analytics dashboard for tracking developer productivity and code quality",
            technologies: ["nextjs", "typescript", "d3js", "postgresql"],
            key_features: ["Custom visualizations", "GitHub integration", "Team analytics"],
            technical_challenges: ["Complex data aggregation", "Real-time updates"],
            repo_url: "https://github.com/example/devmetrics",
            live_url: undefined,
            thumbnail_url: undefined,
            year: "2023",
            project_type: "Open Source",
        }
    ],
    socials: {
        github: "https://github.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
        email: "alex@example.com",
        twitter: "https://twitter.com/alexjohnson",
    },
    contact: {
        message: "Let's work together!",
        cta_text: "Get in touch",
    },
    tech_stack: ["react", "typescript", "nodejs", "python", "aws", "docker", "postgresql", "graphql"]
};

export default function LandingPreviewPage() {
    return (
        <PortfolioDesign1 data={samplePortfolioData} fullWidth={true} />
    );
}

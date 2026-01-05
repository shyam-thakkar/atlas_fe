import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

// Server-side fetch for public portfolio data (used in generateMetadata)
async function getPortfolioData(username: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/public/portfolio/${username}/`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        // Handle nested or direct data structure
        if (data.hero && data.projects) {
            return data;
        } else if (data.portfolio) {
            return data.portfolio;
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch portfolio for metadata:', error);
        return null;
    }
}

interface PortfolioPageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
    const { username } = await params;
    const portfolio = await getPortfolioData(username);

    if (!portfolio) {
        return {
            title: 'Portfolio Not Found',
            description: 'This portfolio does not exist or is not published.',
            robots: { index: false, follow: false },
        };
    }

    const heroData = portfolio.hero || {};
    const name = heroData.full_name || username;
    const title = heroData.headline || 'Portfolio';
    const bio = heroData.short_bio || `View ${name}'s professional portfolio`;
    const profileImage = heroData.profile_image;

    // Build description from available data
    const description = bio.length > 160 ? bio.substring(0, 157) + '...' : bio;

    // Build keywords from tech_stack if available
    const techStack: string[] = portfolio.tech_stack || [];
    const keywords = [name, title, ...techStack.slice(0, 10)];

    return {
        title: `${name} - ${title}`,
        description,
        keywords,
        authors: [{ name }],
        openGraph: {
            type: 'profile',
            title: `${name} - ${title}`,
            description,
            url: `${siteConfig.url}/portfolio/${username}`,
            siteName: siteConfig.name,
            images: profileImage ? [
                {
                    url: profileImage,
                    width: 400,
                    height: 400,
                    alt: `${name}'s profile picture`,
                },
            ] : [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${name}'s Portfolio on ${siteConfig.name}`,
                },
            ],
        },
        twitter: {
            card: 'summary',
            title: `${name} - ${title}`,
            description,
            images: profileImage ? [profileImage] : [siteConfig.ogImage],
        },
        alternates: {
            canonical: `${siteConfig.url}/portfolio/${username}`,
        },
    };
}

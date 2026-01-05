import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifolio.in';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Dynamic portfolio pages - fetch published portfolios from API
  let portfolioPages: MetadataRoute.Sitemap = [];
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/portfolio/published/`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (response.ok) {
      const data = await response.json();
      const usernames: string[] = data.usernames || [];
      
      portfolioPages = usernames.map((username: string) => ({
        url: `${siteUrl}/portfolio/${username}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    // Silently fail - sitemap will just not include dynamic pages
    console.error('Failed to fetch published portfolios for sitemap:', error);
  }

  return [...staticPages, ...portfolioPages];
}

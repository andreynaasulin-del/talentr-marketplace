import { MetadataRoute } from 'next';
import { getAllCategorySlugs } from '@/lib/category-landing-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://talentr.co.il';

    // Static pages
    const staticPages = [
        '',
        '/signin',
        '/signup',
        '/join',
    ];

    // Generate vendor pages dynamically (using mock IDs for now)
    const vendorIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    // Category landing pages
    const categorySlugs = getAllCategorySlugs();

    const staticRoutes: MetadataRoute.Sitemap = staticPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    const vendorRoutes: MetadataRoute.Sitemap = vendorIds.map((id) => ({
        url: `${baseUrl}/vendor/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Book category pages
    const bookRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
        url: `${baseUrl}/book/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // Become category pages
    const becomeRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
        url: `${baseUrl}/become/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    return [...staticRoutes, ...vendorRoutes, ...bookRoutes, ...becomeRoutes];
}

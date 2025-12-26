import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://event-marketplace-mvp.vercel.app';

    // Static pages
    const staticPages = [
        '',
        '/signin',
        '/signup',
        '/join',
    ];

    // Generate vendor pages dynamically (using mock IDs for now)
    const vendorIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

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

    return [...staticRoutes, ...vendorRoutes];
}

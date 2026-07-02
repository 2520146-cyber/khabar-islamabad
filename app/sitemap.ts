import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khabar.islamabad.pk';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/timeline`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/archive`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  // Category pages
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
    });

    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // Article pages
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 1000,
    });

    const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/${article.category?.slug || 'pakistan'}/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...categoryPages, ...articlePages];
  } catch {
    return staticPages;
  }
}

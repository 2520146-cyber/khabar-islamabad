import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khabar.islamabad.pk';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cms', '/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

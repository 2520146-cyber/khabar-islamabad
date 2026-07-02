import prisma from '@/lib/prisma';
import TimelineClient from '@/components/timeline/TimelineClient';
import { subDays, format } from 'date-fns';

async function getTimelineData() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: thirtyDaysAgo },
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
      },
    });

    // Group by date
    const grouped = new Map<string, typeof articles>();

    for (const article of articles) {
      const dateKey = article.publishedAt
        ? format(new Date(article.publishedAt), 'yyyy-MM-dd')
        : 'unknown';

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(article);
    }

    const groupedDays = Array.from(grouped.entries()).map(([date, arts]) => ({
      date,
      articles: arts.map((a) => ({
        ...a,
        // Serialize dates for client component
        publishedAt: a.publishedAt?.toISOString() || null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
    }));

    return groupedDays;
  } catch (error) {
    console.error('Timeline data fetch error:', error);
    return [];
  }
}

export default async function TimelinePage() {
  const groupedDays = await getTimelineData();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">News Timeline</h1>
        <p className="text-gray-500 text-sm">Organised by date and time — last 30 days</p>
      </div>

      <TimelineClient groupedDays={groupedDays} />

      {/* Attribution */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 mt-12">
        © 2026 Khabar Islamabad. All Rights Reserved. | Designed &amp; Developed by Abdullah Ashfaq Raja
      </div>
    </div>
  );
}

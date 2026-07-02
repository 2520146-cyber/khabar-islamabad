import prisma from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import ArchiveFilters from './ArchiveFilters';

interface SearchParams {
  y?: string;
  m?: string;
  d?: string;
  category?: string;
  province?: string;
  sort?: string;
  q?: string;
  page?: string;
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = { status: 'PUBLISHED' };

  if (searchParams.y) {
    const year = parseInt(searchParams.y);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    where.publishedAt = { gte: startDate, lt: endDate };

    if (searchParams.m) {
      const month = parseInt(searchParams.m) - 1;
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 1);
      where.publishedAt = { gte: startOfMonth, lt: endOfMonth };

      if (searchParams.d) {
        const day = parseInt(searchParams.d);
        const startOfDay = new Date(year, month, day);
        const endOfDay = new Date(year, month, day + 1);
        where.publishedAt = { gte: startOfDay, lt: endOfDay };
      }
    }
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.province) {
    where.province = searchParams.province;
  }

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: 'insensitive' } },
      { contentHtml: { contains: searchParams.q, mode: 'insensitive' } },
    ];
  }

  const orderBy: any =
    searchParams.sort === 'oldest'
      ? { publishedAt: 'asc' }
      : searchParams.sort === 'views'
      ? { viewCount: 'desc' }
      : { publishedAt: 'desc' };

  const [rawArticles, total, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
      },
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  const articles = rawArticles.map((a) => ({
    ...a,
    publishedAt: a.publishedAt?.toISOString() || null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  const totalPages = Math.ceil(total / limit);

  const buildUrl = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const current: Record<string, string> = {
      y: searchParams.y || '',
      m: searchParams.m || '',
      d: searchParams.d || '',
      category: searchParams.category || '',
      province: searchParams.province || '',
      sort: searchParams.sort || '',
      q: searchParams.q || '',
    };
    const merged = { ...current, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/archive?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar size={24} className="text-brand-red" />
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Archive</h1>
          <p className="text-sm text-gray-500">
            {searchParams.q
              ? `Showing ${total} results for "${searchParams.q}"`
              : `${total} articles in the archive`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          {articles.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p>No articles found with the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${article.category?.slug || 'pakistan'}/${article.slug}`}
                  className="group flex items-start gap-4 py-4 border-b border-gray-50 hover:bg-surface-1 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-xs text-gray-400 font-mono pt-1">
                    {article.publishedAt ? format(new Date(article.publishedAt), 'd MMM') : ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
                      {article.category?.name}
                    </span>
                    <h3 className="text-sm font-serif font-medium text-ink group-hover:text-brand-red transition-colors line-clamp-2 leading-snug mt-0.5">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {article.author?.name} · {article.readingTimeMinutes} min · {article.viewCount} views
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-surface-1"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, page - 2) + i;
                if (pageNum > totalPages) return null;
                return (
                  <Link
                    key={pageNum}
                    href={buildUrl({ page: String(pageNum) })}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      pageNum === page
                        ? 'bg-brand-red text-white'
                        : 'border border-gray-200 hover:bg-surface-1'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-surface-1"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar filters — client component */}
        <aside className="space-y-6">
          <ArchiveFilters
            categories={categories}
            currentFilters={searchParams}
          />
        </aside>
      </div>

      {/* Attribution */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 mt-12">
        © 2026 Khabar Islamabad. All Rights Reserved. | Designed &amp; Developed by Abdullah Ashfaq Raja
      </div>
    </div>
  );
}

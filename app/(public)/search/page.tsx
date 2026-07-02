import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Search as SearchIcon, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface SearchParams {
  q?: string;
  category?: string;
  page?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  let results: any[] = [];
  let total = 0;

  if (q.trim()) {
    const where: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { subtitle: { contains: q, mode: 'insensitive' } },
        { contentHtml: { contains: q, mode: 'insensitive' } },
      ],
    };

    if (searchParams.category) {
      where.category = { slug: searchParams.category };
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    results = articles.map((a) => ({
      ...a,
      publishedAt: a.publishedAt?.toISOString() || null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));
    total = totalCount;
  }

  const totalPages = Math.ceil(total / limit);

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  const trendingTopics = ['Economy', 'Cricket', 'Elections', 'Technology', 'Climate', 'Inflation'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search header */}
      <div className="mb-8">
        <form action="/search" method="GET" className="relative">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search news, topics, reporters..."
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
            autoFocus
          />
        </form>
      </div>

      {q ? (
        <>
          {/* Results count */}
          <p className="text-sm text-gray-500 mb-4">
            {total} {total === 1 ? 'result' : 'results'} for &apos;{q}&apos;
          </p>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
            <Link
              href={`/search?q=${encodeURIComponent(q)}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                !searchParams.category ? 'bg-brand-red text-white' : 'bg-surface-1 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?q=${encodeURIComponent(q)}&category=${cat.slug}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  searchParams.category === cat.slug
                    ? 'bg-brand-red text-white'
                    : 'bg-surface-1 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-2">No results found for &apos;{q}&apos;</p>
              <p className="text-sm text-gray-400">Try different keywords or browse categories</p>
            </div>
          ) : (
            <div className="space-y-0">
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/${article.category?.slug || 'pakistan'}/${article.slug}`}
                  className="group flex items-start gap-4 py-4 border-b border-gray-50 hover:bg-surface-1 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex-shrink-0 w-12 text-xs text-gray-400 font-mono pt-1">
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
                      {article.author?.name} · {article.readingTimeMinutes} min read
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
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
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
                    href={`/search?q=${encodeURIComponent(q)}&page=${pageNum}`}
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
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-surface-1"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        /* No query — show suggestions */
        <div className="py-12 text-center">
          <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="font-serif text-xl font-semibold text-ink mb-2">Search Khabar Islamabad</h2>
          <p className="text-sm text-gray-500 mb-6">Find the latest news, analysis, and insights</p>

          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-brand-red" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Trending</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${topic}`}
                  className="px-4 py-2 bg-surface-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 mt-12">
        © 2026 Khabar Islamabad. All Rights Reserved. | Designed &amp; Developed by Abdullah Ashfaq Raja
      </div>
    </div>
  );
}

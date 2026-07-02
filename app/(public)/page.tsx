import prisma from '@/lib/prisma';
import HeroSection from '@/components/home/HeroSection';
import NewsGrid from '@/components/home/NewsGrid';
import AIDigestStrip from '@/components/home/AIDigestStrip';
import Link from 'next/link';

function serializeArticles(articles: any[]) {
  return articles.map((a) => ({
    ...a,
    publishedAt: a.publishedAt?.toISOString() || null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

async function getArticles() {
  try {
    const [featuredArticle, topStories, latestNews, politicsStories, businessStories, sportsStories] =
      await Promise.all([
        prisma.article.findFirst({
          where: { isFeatured: true, status: 'PUBLISHED' },
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
          orderBy: { publishedAt: 'desc' },
        }),
        prisma.article.findMany({
          where: { status: 'PUBLISHED' },
          take: 5,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
        }),
        prisma.article.findMany({
          where: { status: 'PUBLISHED' },
          take: 6,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
        }),
        prisma.article.findMany({
          where: { status: 'PUBLISHED', category: { slug: 'politics' } },
          take: 3,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
        }),
        prisma.article.findMany({
          where: { status: 'PUBLISHED', category: { slug: 'business' } },
          take: 3,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
        }),
        prisma.article.findMany({
          where: { status: 'PUBLISHED', category: { slug: 'sports' } },
          take: 3,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
        }),
      ]);

    return {
      featuredArticle: featuredArticle ? serializeArticles([featuredArticle])[0] : null,
      topStories: serializeArticles(topStories),
      latestNews: serializeArticles(latestNews),
      politicsStories: serializeArticles(politicsStories),
      businessStories: serializeArticles(businessStories),
      sportsStories: serializeArticles(sportsStories),
    };
  } catch (error) {
    console.error('Homepage data fetch error:', error);
    return {
      featuredArticle: null,
      topStories: [],
      latestNews: [],
      politicsStories: [],
      businessStories: [],
      sportsStories: [],
    };
  }
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/[0.05]">
      <div className="flex items-center gap-3">
        <div className="w-[3px] h-5 rounded-full" style={{ background: 'var(--gradient-red)' }} />
        <h2 className="headline-section text-[20px] text-ink tracking-[-0.02em]">{title}</h2>
      </div>
      <Link href={href} className="text-[11px] font-bold text-brand-red hover:text-red-800 transition-colors uppercase tracking-[0.1em]">
        View all →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const data = await getArticles();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 bg-mesh min-h-screen">
      {/* Hero */}
      <HeroSection featuredArticle={data.featuredArticle} topStories={data.topStories} />

      {/* AI Digest */}
      <AIDigestStrip />

      {/* Latest News */}
      <section>
        <SectionHeader title="Latest News" href="/pakistan" />
        <NewsGrid articles={data.latestNews} />
      </section>

      {/* Politics */}
      {data.politicsStories.length > 0 && (
        <section className="mt-14">
          <SectionHeader title="Politics" href="/politics" />
          <NewsGrid articles={data.politicsStories} columns={3} />
        </section>
      )}

      {/* Business */}
      {data.businessStories.length > 0 && (
        <section className="mt-14">
          <SectionHeader title="Business" href="/business" />
          <NewsGrid articles={data.businessStories} columns={3} />
        </section>
      )}

      {/* Sports */}
      {data.sportsStories.length > 0 && (
        <section className="mt-14">
          <SectionHeader title="Sports" href="/sports" />
          <NewsGrid articles={data.sportsStories} columns={3} />
        </section>
      )}

      {/* Attribution */}
      <div className="mt-20 pt-10 pb-6 text-center border-t border-black/[0.04]">
        <div className="accent-line mx-auto mb-5" />
        <p className="text-[11px] text-ink-5 font-medium">
          © 2026 Khabar Islamabad. All Rights Reserved.
        </p>
        <p className="text-[10px] text-ink-6 mt-1.5">
          Designed &amp; Developed by <span className="text-ink-4 font-semibold">Abdullah Ashfaq Raja</span>
        </p>
      </div>
    </div>
  );
}

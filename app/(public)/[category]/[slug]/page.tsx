import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ArticleHero from '@/components/article/ArticleHero';
import ArticleBody from '@/components/article/ArticleBody';
import AIPanel from '@/components/article/AIPanel';
import ReadingProgress from '@/components/article/ReadingProgress';
import { Clock, Eye, Share2 } from 'lucide-react';

interface PageProps {
  params: { category: string; slug: string };
}

async function getArticle(category: string, slug: string) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        category: { slug: category },
      },
      include: {
        author: { select: { id: true, name: true, image: true, bio: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { include: { tag: true } },
      },
    });

    return article;
  } catch {
    return null;
  }
}

function serializeArticle(article: any) {
  return {
    ...article,
    publishedAt: article.publishedAt?.toISOString() || null,
    scheduledAt: article.scheduledAt?.toISOString() || null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.category, params.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.subtitle || article.title,
    openGraph: {
      title: article.title,
      description: article.subtitle || article.title,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author?.name],
      images: article.heroImageUrl ? [{ url: article.heroImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle || article.title,
      images: article.heroImageUrl ? [article.heroImageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.category, params.slug);

  if (!article) {
    notFound();
  }

  // Increment view count (non-blocking)
  prisma.article
    .update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  // Fetch related stories
  const relatedStories = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    take: 4,
    orderBy: { publishedAt: 'desc' },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  const serializedArticle = serializeArticle(article);

  return (
    <>
      <ReadingProgress />

      <article className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content — 65% */}
          <div className="lg:col-span-2">
            <ArticleHero article={serializedArticle} />
            <ArticleBody article={serializedArticle} />
          </div>

          {/* Sidebar — 35% */}
          <aside className="space-y-6">
            {/* Reading stats */}
            <div className="border border-gray-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Article Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span>{article.readingTimeMinutes} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-gray-400" />
                  <span>{article.viewCount.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 size={14} className="text-gray-400" />
                  <span>{article.shareCount.toLocaleString()} shares</span>
                </div>
              </div>
            </div>

            {/* AI Panel */}
            <AIPanel article={serializedArticle} />

            {/* Related stories */}
            {relatedStories.length > 0 && (
              <div className="border border-gray-100 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Related Stories</h3>
                <div className="space-y-3">
                  {relatedStories.map((story) => (
                    <a
                      key={story.id}
                      href={`/${story.category?.slug || 'pakistan'}/${story.slug}`}
                      className="block text-sm text-gray-700 hover:text-brand-red transition-colors leading-snug"
                    >
                      {story.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Attribution bar */}
        <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 mt-12">
          © 2026 Khabar Islamabad. All Rights Reserved. | Designed &amp; Developed by Abdullah Ashfaq Raja
        </div>
      </article>
    </>
  );
}

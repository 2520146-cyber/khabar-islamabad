import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import NewsGrid from '@/components/home/NewsGrid';
import Link from 'next/link';

interface PageProps {
  params: { category: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} News`,
    description: `Latest ${category.name} news from Khabar Islamabad — Pakistan's most trusted digital newsroom`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) notFound();

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId: category.id,
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-brand-red">Home</Link>
          <span>›</span>
          <span className="text-gray-400">{category.name}</span>
        </nav>
        <h1 className="font-serif text-3xl font-semibold text-ink">{category.name}</h1>
        {category.nameUr && (
          <p className="text-lg text-gray-500 font-urdu mt-1">{category.nameUr}</p>
        )}
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p>No articles published in this category yet.</p>
        </div>
      ) : (
        <NewsGrid articles={articles} columns={3} />
      )}

      {/* Attribution */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 mt-12">
        © 2026 Khabar Islamabad. All Rights Reserved. | Designed &amp; Developed by Abdullah Ashfaq Raja
      </div>
    </div>
  );
}

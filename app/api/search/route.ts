import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!q || q.trim().length === 0) {
      return NextResponse.json({ hits: [], total: 0, query: '' });
    }

    const where: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { subtitle: { contains: q, mode: 'insensitive' } },
        { contentHtml: { contains: q, mode: 'insensitive' } },
      ],
    };

    if (category) {
      where.category = { slug: category };
    }

    const startTime = Date.now();

    const articles = await prisma.article.findMany({
      where,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
      },
    });

    const hits = articles.map((article) => ({
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      slug: article.slug,
      category: article.category.name,
      categorySlug: article.category.slug,
      authorName: article.author.name,
      heroImageUrl: article.heroImageUrl,
      readingTimeMinutes: article.readingTimeMinutes,
      publishedAt: article.publishedAt,
    }));

    return NextResponse.json({
      hits,
      estimatedTotalHits: hits.length,
      processingTimeMs: Date.now() - startTime,
      query: q,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'PUBLISHED';
    const isFeatured = searchParams.get('isFeatured');
    const isBreaking = searchParams.get('isBreaking');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'latest';
    const province = searchParams.get('province');
    const tag = searchParams.get('tag');
    const search = searchParams.get('q');

    const where: any = {};

    if (status) where.status = status;
    if (category) where.category = { slug: category };
    if (isFeatured === 'true') where.isFeatured = true;
    if (isBreaking === 'true') where.isBreaking = true;
    if (province) where.province = province;
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { contentHtml: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      sort === 'views'
        ? { viewCount: 'desc' }
        : sort === 'shares'
        ? { shareCount: 'desc' }
        : sort === 'oldest'
        ? { publishedAt: 'asc' }
        : { publishedAt: 'desc' };

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          tags: { include: { tag: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Articles fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (!['SUPER_ADMIN', 'EDITOR_IN_CHIEF', 'MANAGING_EDITOR', 'EDITOR', 'REPORTER', 'JOURNALIST'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      contentJson,
      contentHtml,
      categoryId,
      slug,
      heroImageUrl,
      heroImageAlt,
      heroImageCaption,
      status,
      location,
      province,
      isFeatured,
      isBreaking,
      tags,
    } = body;

    const article = await prisma.article.create({
      data: {
        title,
        subtitle,
        contentJson: contentJson || {},
        contentHtml: contentHtml || '',
        categoryId,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        heroImageUrl,
        heroImageAlt,
        heroImageCaption,
        status: status || 'DRAFT',
        location,
        province,
        isFeatured: isFeatured || false,
        isBreaking: isBreaking || false,
        authorId: session.user.id,
        readingTimeMinutes: Math.max(1, Math.ceil((contentHtml?.split(/\s+/).length || 0) / 200)),
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Article creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

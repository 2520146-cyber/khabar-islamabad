import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        article: {
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        articleId,
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleId } = await request.json();

    await prisma.bookmark.delete({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 });
  }
}

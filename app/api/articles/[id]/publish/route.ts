import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (!['SUPER_ADMIN', 'EDITOR_IN_CHIEF', 'MANAGING_EDITOR', 'EDITOR'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        editorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to publish article' }, { status: 500 });
  }
}

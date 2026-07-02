import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import EditorClient from './EditorClient';

export default async function EditorPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  let article = null;

  if (searchParams.id) {
    article = await prisma.article.findUnique({
      where: { id: searchParams.id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <EditorClient
      article={article}
      categories={categories}
      userId={(session.user as any).id}
      userRole={(session.user as any).role}
    />
  );
}

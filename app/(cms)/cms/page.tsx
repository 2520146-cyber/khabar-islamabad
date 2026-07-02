import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import {
  FileText,
  TrendingUp,
  Eye,
  Share2,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default async function CMSDashboard() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const [totalArticles, publishedCount, draftCount, reviewCount, totalViews, recentArticles] =
    await Promise.all([
      prisma.article.count({ where: { authorId: userId } }),
      prisma.article.count({ where: { authorId: userId, status: 'PUBLISHED' } }),
      prisma.article.count({ where: { authorId: userId, status: 'DRAFT' } }),
      prisma.article.count({ where: { authorId: userId, status: 'REVIEW' } }),
      prisma.article.aggregate({ where: { authorId: userId }, _sum: { viewCount: true } }),
      prisma.article.findMany({
        where: { authorId: userId },
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
        },
      }),
    ]);

  const stats = [
    { label: 'Total Articles', value: totalArticles, icon: FileText, color: 'text-blue-600' },
    { label: 'Published', value: publishedCount, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Drafts', value: draftCount, icon: Clock, color: 'text-yellow-600' },
    { label: 'In Review', value: reviewCount, icon: AlertCircle, color: 'text-orange-600' },
    { label: 'Total Views', value: totalViews._sum.viewCount || 0, icon: Eye, color: 'text-purple-600' },
  ];

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-700',
    REVIEW: 'bg-orange-100 text-orange-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    SCHEDULED: 'bg-blue-100 text-blue-700',
    ARCHIVED: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        <Link
          href="/cms/editor"
          className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-ink">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent articles */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold">Recent Articles</h2>
        </div>

        {recentArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p>No articles yet. Start writing!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/cms/editor?id=${article.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-surface-1 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {article.category?.name} · {article.viewCount} views
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    statusColors[article.status] || ''
                  }`}
                >
                  {article.status}
                </span>
                <span className="text-xs text-gray-400">
                  {article.updatedAt.toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

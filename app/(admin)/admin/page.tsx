import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || !['SUPER_ADMIN', 'EDITOR_IN_CHIEF'].includes(role)) {
    redirect('/cms');
  }

  const [
    totalUsers,
    totalArticles,
    publishedToday,
    pendingReview,
    totalViews,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.article.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.article.count({ where: { status: 'REVIEW' } }),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600' },
    { label: 'Total Articles', value: totalArticles, icon: FileText, color: 'text-green-600' },
    { label: 'Published Today', value: publishedToday, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Pending Review', value: pendingReview, icon: AlertCircle, color: 'text-orange-600' },
    { label: 'Total Views', value: totalViews._sum.viewCount || 0, icon: Eye, color: 'text-pink-600' },
  ];

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-red-100 text-red-700',
    EDITOR_IN_CHIEF: 'bg-purple-100 text-purple-700',
    EDITOR: 'bg-blue-100 text-blue-700',
    REPORTER: 'bg-green-100 text-green-700',
    JOURNALIST: 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform overview and management</p>
        </div>
        <Link href="/admin/users" className="text-sm text-brand-red hover:underline">
          Manage Users →
        </Link>
      </div>

      {/* Stats */}
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

      {/* Users table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-surface-1 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`w-2 h-2 inline-block rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

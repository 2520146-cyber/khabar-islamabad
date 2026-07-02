import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || !['SUPER_ADMIN', 'EDITOR_IN_CHIEF'].includes(role)) {
    redirect('/cms');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
  });

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-red-100 text-red-700',
    EDITOR_IN_CHIEF: 'bg-purple-100 text-purple-700',
    MANAGING_EDITOR: 'bg-indigo-100 text-indigo-700',
    EDITOR: 'bg-blue-100 text-blue-700',
    REPORTER: 'bg-green-100 text-green-700',
    JOURNALIST: 'bg-teal-100 text-teal-700',
    GUEST_AUTHOR: 'bg-gray-100 text-gray-600',
    PHOTOGRAPHER: 'bg-pink-100 text-pink-700',
    VIDEO_EDITOR: 'bg-yellow-100 text-yellow-700',
    AD_MANAGER: 'bg-orange-100 text-orange-700',
    MODERATOR: 'bg-cyan-100 text-cyan-700',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-ink">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Articles</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-surface-1 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{user._count.articles}</td>
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1.5 text-xs ${user.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
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

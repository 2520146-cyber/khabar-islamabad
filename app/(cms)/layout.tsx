import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ImageIcon,
  BarChart3,
  Users,
  Zap,
  MessageSquare,
} from 'lucide-react';
import CMSLogoutButton from './CMSLogoutButton';

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-surface-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100">
          <Link href="/cms" className="flex items-baseline gap-0">
            <span className="font-serif text-lg font-bold text-brand-red">kh</span>
            <span className="font-serif text-lg font-bold text-ink">abar</span>
            <span className="text-xs text-gray-400 ml-1">cms</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
          <Link
            href="/cms"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-surface-1 rounded-lg transition-colors"
          >
            <BarChart3 size={16} /> Dashboard
          </Link>
          <Link
            href="/cms/editor"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-surface-1 rounded-lg transition-colors"
          >
            <FileText size={16} /> Editor
          </Link>
          <Link
            href="/cms/media"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-surface-1 rounded-lg transition-colors"
          >
            <ImageIcon size={16} /> Media
          </Link>
          <Link
            href="/cms/ads"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-surface-1 rounded-lg transition-colors"
          >
            <Zap size={16} /> Ads
          </Link>
          <Link
            href="/cms/comments"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-surface-1 rounded-lg transition-colors"
          >
            <MessageSquare size={16} /> Comments
          </Link>
          {(session.user as any)?.role === 'SUPER_ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-surface-1 rounded-lg transition-colors"
            >
              <Users size={16} /> Admin
            </Link>
          )}
        </nav>

        {/* User info */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center text-xs font-bold">
              {(session.user as any)?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{(session.user as any)?.role}</p>
            </div>
            <CMSLogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

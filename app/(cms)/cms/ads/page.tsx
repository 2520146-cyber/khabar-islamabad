import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || !['SUPER_ADMIN', 'AD_MANAGER'].includes(role)) {
    redirect('/cms');
  }

  const ads = await prisma.advertisement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

  const slotColors: Record<string, string> = {
    TOP_BANNER: 'bg-blue-100 text-blue-700',
    HERO: 'bg-purple-100 text-purple-700',
    SIDEBAR: 'bg-green-100 text-green-700',
    BETWEEN_PARAGRAPHS: 'bg-yellow-100 text-yellow-700',
    STICKY_FOOTER: 'bg-orange-100 text-orange-700',
    NATIVE: 'bg-teal-100 text-teal-700',
    POPUP: 'bg-red-100 text-red-700',
    VIDEO: 'bg-pink-100 text-pink-700',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Ad Manager</h1>
          <p className="text-sm text-gray-500 mt-1">{ads.length} advertisements</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Impressions</p>
          <p className="text-2xl font-bold text-ink">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Clicks</p>
          <p className="text-2xl font-bold text-ink">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">Average CTR</p>
          <p className="text-2xl font-bold text-ink">{avgCtr}%</p>
        </div>
      </div>

      {/* Ads table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase">Slot</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase">Device</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase">Views</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase">Clicks</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase">CTR</th>
              </tr>
            </thead>
            <tbody>
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                    No advertisements yet. Create one to get started.
                  </td>
                </tr>
              ) : (
                ads.map((ad) => {
                  const ctr = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={ad.id} className="border-b border-gray-50 hover:bg-surface-1">
                      <td className="px-5 py-3 text-sm font-medium">{ad.name}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${slotColors[ad.slotType] || ''}`}>
                          {ad.slotType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">{ad.device}</td>
                      <td className="px-5 py-3">
                        <span className={`w-2 h-2 inline-block rounded-full ${ad.isActive && !ad.isPaused ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </td>
                      <td className="px-5 py-3 text-sm">{ad.views.toLocaleString()}</td>
                      <td className="px-5 py-3 text-sm">{ad.clicks.toLocaleString()}</td>
                      <td className="px-5 py-3 text-sm font-medium">{ctr}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Filter, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface ArchiveFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  currentFilters: {
    y?: string;
    m?: string;
    d?: string;
    category?: string;
    province?: string;
    sort?: string;
    q?: string;
  };
}

export default function ArchiveFilters({ categories, currentFilters }: ArchiveFiltersProps) {
  const router = useRouter();

  const buildUrl = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const current: Record<string, string> = {
      y: currentFilters.y || '',
      m: currentFilters.m || '',
      d: currentFilters.d || '',
      category: currentFilters.category || '',
      province: currentFilters.province || '',
      sort: currentFilters.sort || '',
      q: currentFilters.q || '',
    };
    const merged = { ...current, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/archive?${params.toString()}`;
  };

  const navigate = (overrides: Record<string, string>) => {
    router.push(buildUrl(overrides));
  };

  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Filter size={14} /> Filters
      </h3>

      {/* Year */}
      <div className="space-y-3 mb-4">
        <label className="block text-xs text-gray-500">Year</label>
        <select
          defaultValue={currentFilters.y || ''}
          onChange={(e) => navigate({ y: e.target.value, page: '1' })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All years</option>
          {[2026, 2025, 2024].map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>

        {/* Month */}
        <label className="block text-xs text-gray-500">Month</label>
        <select
          defaultValue={currentFilters.m || ''}
          onChange={(e) => navigate({ m: e.target.value, page: '1' })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              {format(new Date(2026, i, 1), 'MMMM')}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-2">Category</label>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl({ category: currentFilters.category === cat.slug ? '' : cat.slug, page: '1' })}
              className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                currentFilters.category === cat.slug
                  ? 'bg-brand-red/10 text-brand-red font-medium'
                  : 'text-gray-700 hover:bg-surface-1'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Province */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-2">Province</label>
        <div className="space-y-1.5">
          {['FEDERAL', 'PUNJAB', 'SINDH', 'KPK', 'BALOCHISTAN', 'AJK', 'GB'].map((prov) => (
            <Link
              key={prov}
              href={buildUrl({ province: currentFilters.province === prov ? '' : prov, page: '1' })}
              className={`block px-3 py-1.5 rounded text-sm capitalize transition-colors ${
                currentFilters.province === prov
                  ? 'bg-brand-red/10 text-brand-red font-medium'
                  : 'text-gray-700 hover:bg-surface-1'
              }`}
            >
              {prov.toLowerCase().replace('_', ' ')}
            </Link>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-2">Sort by</label>
        <select
          defaultValue={currentFilters.sort || ''}
          onChange={(e) => navigate({ sort: e.target.value, page: '1' })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="views">Most viewed</option>
        </select>
      </div>

      {/* Reset */}
      <Link
        href="/archive"
        className="flex items-center gap-2 justify-center w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-surface-1 transition-colors"
      >
        <RotateCcw size={14} /> Reset filters
      </Link>
    </div>
  );
}

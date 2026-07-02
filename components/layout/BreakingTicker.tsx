'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

interface BreakingArticle {
  id: string;
  title: string;
  slug: string;
  category: { slug: string };
}

export default function BreakingTicker() {
  const [headlines, setHeadlines] = useState<BreakingArticle[]>([]);

  useEffect(() => {
    fetch('/api/articles?isBreaking=true&limit=8')
      .then((r) => r.json())
      .then((d) => setHeadlines(d.articles || []))
      .catch(() => {});
  }, []);

  if (headlines.length === 0) return null;

  const doubled = [...headlines, ...headlines];

  return (
    <div className="overflow-hidden" style={{ background: 'linear-gradient(90deg, #C0161D 0%, #E53E3E 50%, #C0161D 100%)' }}>
      <div className="max-w-[1280px] mx-auto flex items-center h-[34px] px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex items-center gap-1.5 mr-5 pr-5 border-r border-white/20">
          <Zap size={10} className="fill-white text-white" />
          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">Breaking</span>
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="ticker-scroll flex items-center whitespace-nowrap">
            {doubled.map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={`/${article.category?.slug || 'pakistan'}/${article.slug}`}
                className="inline-flex items-center gap-3 px-5 text-[11.5px] font-semibold text-white/90 hover:text-white transition-colors duration-200"
              >
                <span>{article.title}</span>
                <span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

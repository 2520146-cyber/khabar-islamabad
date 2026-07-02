'use client';

import { useState, useMemo } from 'react';
import TimelineDay from './TimelineDay';
import { format, isToday, isYesterday } from 'date-fns';

interface TimelineClientProps {
  groupedDays: {
    date: string;
    articles: any[];
  }[];
}

const CATEGORIES = ['All', 'Pakistan', 'Politics', 'Business', 'World', 'Tech', 'Sports'];
const TIME_RANGES = ['Today', 'This week', 'This month'];

export default function TimelineClient({ groupedDays }: TimelineClientProps) {
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(() => {
    // Collapse all days except today
    const collapsed = new Set<string>();
    groupedDays.forEach((day) => {
      const date = new Date(day.date + 'T00:00:00');
      if (!isToday(date)) {
        collapsed.add(day.date);
      }
    });
    return collapsed;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTimeRange, setActiveTimeRange] = useState('This month');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDay = (date: string) => {
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  // Filter articles
  const filteredDays = useMemo(() => {
    return groupedDays
      .map((day) => {
        let articles = day.articles;

        // Category filter
        if (activeCategory !== 'All') {
          articles = articles.filter(
            (a) => a.category?.name?.toLowerCase() === activeCategory.toLowerCase()
          );
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          articles = articles.filter(
            (a) =>
              a.title?.toLowerCase().includes(q) ||
              a.subtitle?.toLowerCase().includes(q)
          );
        }

        return { ...day, articles };
      })
      .filter((day) => day.articles.length > 0);
  }, [groupedDays, activeCategory, searchQuery]);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-brand-red text-white'
                  : 'bg-surface-1 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Time range pills */}
        <div className="flex gap-1.5 ml-auto">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setActiveTimeRange(range)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTimeRange === range
                  ? 'bg-ink text-white'
                  : 'bg-surface-1 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter headlines..."
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-red w-48"
        />
      </div>

      {/* Timeline */}
      {filteredDays.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <p className="text-sm">No articles found for the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDays.map((day) => {
            const date = new Date(day.date + 'T00:00:00');
            const dayLabel = isToday(date)
              ? 'Today'
              : isYesterday(date)
              ? 'Yesterday'
              : format(date, 'EEEE');

            return (
              <TimelineDay
                key={day.date}
                date={day.date}
                dayLabel={dayLabel}
                fullDate={format(date, 'd MMMM yyyy')}
                articles={day.articles}
                isCollapsed={collapsedDays.has(day.date)}
                onToggle={() => toggleDay(day.date)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

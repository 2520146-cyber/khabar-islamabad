'use client';

import { ChevronRight } from 'lucide-react';
import TimelineStory from './TimelineStory';

interface TimelineDayProps {
  date: string;
  dayLabel: string;
  fullDate: string;
  articles: any[];
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function TimelineDay({
  date,
  dayLabel,
  fullDate,
  articles,
  isCollapsed,
  onToggle,
}: TimelineDayProps) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Day header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-1 transition-colors text-left"
      >
        <ChevronRight
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            !isCollapsed ? 'rotate-90' : ''
          }`}
        />
        <span className="font-serif text-base font-semibold text-ink">{dayLabel}</span>
        <span className="text-sm text-gray-500">{fullDate}</span>
        <div className="flex-1 h-px bg-gray-100 mx-2" />
        <span className="text-xs text-gray-400 bg-surface-1 px-2 py-0.5 rounded-full">
          {articles.length} {articles.length === 1 ? 'story' : 'stories'}
        </span>
      </button>

      {/* Collapsed preview */}
      {isCollapsed && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 pl-7">
            {articles.length} stories from {dayLabel.toLowerCase()} — click to expand
          </p>
        </div>
      )}

      {/* Expanded articles */}
      {!isCollapsed && (
        <div className="border-t border-gray-50">
          {articles.map((article, index) => (
            <TimelineStory
              key={article.id}
              article={article}
              isLast={index === articles.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

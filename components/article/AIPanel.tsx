'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface AIPanelProps {
  article: any;
}

export default function AIPanel({ article }: AIPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(article.aiSummary || '');
  const [faq, setFaq] = useState<any[]>(article.aiFaq || []);
  const [activeTab, setActiveTab] = useState<'summary' | 'faq'>('summary');

  const generateAISummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'summary', content: article.contentHtml, articleId: article.id }),
      });
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
    } catch {}
    setLoading(false);
  };

  const generateFAQ = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'faq', content: article.contentHtml, articleId: article.id }),
      });
      const data = await res.json();
      if (data.faqs) setFaq(data.faqs);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="glass-card overflow-hidden !p-0">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-black/[0.04] bg-gradient-to-r from-purple-50/80 to-transparent"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-[13px] font-bold text-ink">AI Insights</span>
        </div>
        {expanded ? <ChevronUp size={15} className="text-ink-5" /> : <ChevronDown size={15} className="text-ink-5" />}
      </button>

      {expanded && (
        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-1.5 mb-5">
            {(['summary', 'faq'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.06em] transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-ink-5 hover:text-ink-3 hover:bg-pearl'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center gap-3 py-8 justify-center text-ink-5">
              <Loader2 size={16} className="animate-spin text-purple-500" />
              <span className="text-[13px] font-medium">Generating...</span>
            </div>
          ) : (
            <>
              {activeTab === 'summary' && (
                <div>
                  {summary ? (
                    <p className="body-text text-[13px] leading-[1.8]">{summary}</p>
                  ) : (
                    <button
                      onClick={generateAISummary}
                      className="flex items-center gap-2 text-[13px] font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <Lightbulb size={14} /> Generate AI summary
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'faq' && (
                <div>
                  {faq.length > 0 ? (
                    <div className="space-y-4">
                      {faq.map((item, i) => (
                        <div key={i} className="text-[13px]">
                          <p className="font-bold text-ink mb-1.5">Q: {item.question}</p>
                          <p className="body-text text-[12px] leading-relaxed">A: {item.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={generateFAQ}
                      className="flex items-center gap-2 text-[13px] font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <Lightbulb size={14} /> Generate FAQ
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';

const DIGEST_TOPICS = [
  { key: 'economy', label: 'Economy' },
  { key: 'politics', label: 'Politics' },
  { key: 'sports', label: 'Sports' },
  { key: 'world', label: 'World' },
];

export default function AIDigestStrip() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState('');
  const [digest, setDigest] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDigest = async (topic: string) => {
    setActiveTopic(topic);
    setModalOpen(true);
    setLoading(true);
    setDigest('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'digest', title: topic, content: `Latest ${topic} news from Pakistan` }),
      });
      const data = await res.json();
      setDigest(data.digest || 'Unable to generate digest at this time.');
    } catch {
      setDigest('Unable to generate digest. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="mt-10 mb-10 glass-card !rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-mesh">
        <div className="flex items-center gap-3">
          <span className="badge-ai">
            <Sparkles size={9} /> AI digest
          </span>
          <span className="text-[13px] text-ink-3 font-semibold">
            Catch up on today in 30 seconds →
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {DIGEST_TOPICS.map((topic) => (
            <button
              key={topic.key}
              onClick={() => fetchDigest(topic.key)}
              className="btn-pill hover:!border-brand-red/20 hover:!text-brand-red"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)' }}
          onClick={() => setModalOpen(false)}
        >
          <div className="glass-card w-full max-w-lg mx-4 p-7 relative animate-slide-up !shadow-[0_30px_80px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 p-2 hover:bg-pearl rounded-xl transition-colors">
              <X size={18} className="text-ink-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}>
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="headline-section text-[17px] capitalize">{activeTopic} Digest</h3>
                <p className="text-[11px] text-ink-5 font-medium mt-0.5">AI-generated summary</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 py-12 justify-center text-ink-5">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-[13px] font-medium">Generating...</span>
              </div>
            ) : (
              <p className="body-text text-[14px] leading-[1.8]">{digest}</p>
            )}

            <div className="mt-6 pt-4 border-t border-black/[0.04] flex items-center justify-between">
              <span className="text-[10px] text-ink-6 font-medium">Powered by Gemini AI</span>
              <span className="text-[10px] text-ink-6 font-medium">Updated hourly</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

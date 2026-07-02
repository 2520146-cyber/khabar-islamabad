'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface AdSlotProps {
  slotType: string;
  className?: string;
}

interface Ad {
  id: string;
  name: string;
  imageUrl: string;
  targetUrl: string;
  slotType: string;
}

export default function AdSlot({ slotType, className = '' }: AdSlotProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const trackedRef = useRef(false);

  useEffect(() => {
    // Detect device
    const isMobile = window.innerWidth < 768;
    const device = isMobile ? 'MOBILE' : 'DESKTOP';

    fetch(`/api/ads?slot=${slotType}&device=${device}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setAd(data);

          // Track impression
          if (!trackedRef.current) {
            fetch(`/api/ads/${data.id}/view`, { method: 'POST' });
            trackedRef.current = true;
          }

          // Popup delay
          if (slotType === 'POPUP') {
            setTimeout(() => {
              const popupDismissed = sessionStorage.getItem(`ad_popup_dismissed_${data.id}`);
              if (!popupDismissed) {
                setShowPopup(true);
              }
            }, 30000);
          }
        }
      })
      .catch(() => {});
  }, [slotType]);

  if (!ad || dismissed) return null;

  const handleClick = () => {
    fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (slotType === 'POPUP') {
      sessionStorage.setItem(`ad_popup_dismissed_${ad.id}`, 'true');
    }
  };

  // Popup ad
  if (slotType === 'POPUP' && showPopup) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
          >
            ✕
          </button>
          <div className="cursor-pointer" onClick={handleClick}>
            <p className="text-[10px] text-gray-400 px-3 pt-2">Advertisement</p>
            <Image
              src={ad.imageUrl}
              alt={ad.name}
              width={600}
              height={400}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  // Sticky footer ad
  if (slotType === 'STICKY_FOOTER') {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          <p className="text-[10px] text-gray-400">Advertisement</p>
          <div className="cursor-pointer flex-1 mx-4" onClick={handleClick}>
            <Image
              src={ad.imageUrl}
              alt={ad.name}
              width={728}
              height={90}
              className="w-full max-h-16 object-contain"
            />
          </div>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 text-sm">
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Standard ad
  return (
    <div className={className}>
      <p className="text-[10px] text-gray-400 mb-1">Advertisement</p>
      <div className="cursor-pointer rounded-lg overflow-hidden border border-gray-100" onClick={handleClick}>
        <Image
          src={ad.imageUrl}
          alt={ad.name}
          width={300}
          height={250}
          className="w-full"
        />
      </div>
    </div>
  );
}

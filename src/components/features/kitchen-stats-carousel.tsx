'use client';

import { useEffect, useRef } from 'react';
import { CompletedOrderIcon, StarIcon } from '@/components/icons';

interface KitchenStatsCarouselProps {
  totalOrders: number;
  rating?: number;
  reviewCount?: number;
}

export function KitchenStatsCarousel({
  totalOrders,
  rating,
  reviewCount,
}: KitchenStatsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const cardWidth = el.firstElementChild?.clientWidth ?? 0;
      const gap = 12;
      const maxIndex = el.children.length - 1;
      indexRef.current = indexRef.current >= maxIndex ? 0 : indexRef.current + 1;
      el.scrollTo({ left: indexRef.current * (cardWidth + gap), behavior: 'smooth' });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={scrollRef} className="mb-4 flex scrollbar-none gap-3 overflow-x-hidden pb-1">
      {/* Stats card */}
      <div className="flex h-21 w-[90vw] shrink-0 items-center rounded-2xl border border-[#EDEDED] bg-white px-4 text-center shadow-[0px_4px_20px_0px_#0000000D]">
        <div className="flex flex-1 flex-col items-center gap-0.5">
          <span className="text-xl font-bold text-black">{totalOrders}</span>
          <span className="text-xs font-semibold text-black">Orders</span>
        </div>
        {rating !== undefined && (
          <>
            <div className="h-8 w-px shrink-0 bg-[#E1E1E1]" />
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-neutral-900">{rating}</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
            </div>
          </>
        )}
        {reviewCount !== undefined && (
          <>
            <div className="h-8 w-px shrink-0 bg-[#E1E1E1]" />
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-neutral-900">{reviewCount}</span>
              <span className="text-xs text-neutral-500">Reviews</span>
            </div>
          </>
        )}
      </div>

      {/* Orders completed card */}
      <div className="flex h-24.75 w-[90vw] shrink-0 items-center gap-2 rounded-[20px] border border-[#EDEDED] bg-white py-4 pr-5 pl-5 shadow-[0px_10px_20px_0px_#0000000D]">
        <CompletedOrderIcon className="shrink-0" />
        <div>
          <p className="text-base font-semibold text-neutral-900">{totalOrders} orders completed</p>
          <p className="text-sm text-[#5C5C5C]">
            Customers have successfully ordered from this seller.
          </p>
        </div>
      </div>
    </div>
  );
}

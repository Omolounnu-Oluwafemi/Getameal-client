'use client';

import { useState } from 'react';
import Link from 'next/link';

import { StickyBar } from '@/components/features/sticky-bar';
import { BasketIcon } from '@/components/icons';

interface MealStickyBarProps {
  price: number;
  unit: string;
  qty?: number;
}

export function MealStickyBar({ price, unit, qty = 1 }: MealStickyBarProps) {
  const [basketCount, setBasketCount] = useState(0);

  return (
    <>
      {/* Floating basket button — appears above the sticky bar when items are added */}
      {basketCount > 0 && (
        <Link
          href="/basket"
          className="animate-slide-in-right fixed right-5 bottom-28 z-30 flex h-17 w-17 items-center justify-center rounded-[20px] bg-[#FFFFFFCF] px-4 shadow-[0px_4px_30px_0px_#0000001A]"
          aria-label={`Basket — ${basketCount} items`}
        >
          <div className="relative">
            <BasketIcon />
            <span className="absolute -top-2.5 -right-1 flex h-[20.666667938232422px] w-[20.666667938232422px] items-center justify-center rounded-full border-[1.55px] border-white bg-[#FA2A26] text-[10px] font-bold text-white">
              {basketCount}
            </span>
          </div>
        </Link>
      )}

      {/* Sticky bar */}
      <StickyBar
        amount={price}
        caption={qty > 1 ? `For ${qty} ${unit}s` : `Per ${unit}`}
        actionLabel="Add to Basket"
        onAction={() => setBasketCount((n) => n + 1)}
      />
    </>
  );
}

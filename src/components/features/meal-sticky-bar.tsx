'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { BasketIcon } from '@/components/icons';

interface MealStickyBarProps {
  price: number;
  unit: string;
}

export function MealStickyBar({ price, unit }: MealStickyBarProps) {
  const [basketCount, setBasketCount] = useState(0);

  const formatted = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

  return (
    <>
      {/* Floating basket button — appears above the sticky bar when items are added */}
      {basketCount > 0 && (
        <Link
          href="/basket"
          className="animate-slide-in-right fixed right-5 bottom-24 z-30 flex h-17 w-17 items-center justify-center rounded-[20px] bg-[#FFFFFFCF] px-4 shadow-[0px_4px_30px_0px_#0000001A]"
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
      <div className="fixed inset-x-0 bottom-[-20] z-30 flex h-28 items-center justify-between gap-2.5 rounded-t-[20px] bg-white pt-5 pr-5 pb-10 pl-5 shadow-[0px_-4px_20px_0px_#0000001A]">
        <div>
          <p className="text-[22px] font-bold text-[#000000]">{formatted(price)}</p>
          <p className="text-xs text-[#000000]">Per {unit}</p>
        </div>

        <Button
          variant="brand"
          onClick={() => setBasketCount((n) => n + 1)}
          className="ml-auto h-13 w-[60%] rounded-[50px] text-sm font-semibold active:scale-[0.98]"
        >
          Add to Basket
        </Button>
      </div>
    </>
  );
}

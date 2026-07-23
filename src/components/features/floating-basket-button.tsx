'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { BasketIcon } from '@/components/icons';
import { getCart } from '@/lib/cart';

interface FloatingBasketButtonProps {
  kitchenId: string;
  /** Bump this (e.g. after a successful add-to-basket) to refetch the cart. */
  refreshKey?: number;
}

/**
 * Persistent "cart follows you" bubble — reflects the real, saved cart
 * (not a local counter), so it shows up whether items were added just now
 * or on a previous visit. Renders nothing while the cart is empty.
 */
export function FloatingBasketButton({ kitchenId, refreshKey }: FloatingBasketButtonProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getCart().then((cart) => {
      if (!cancelled) setCount(cart?.totalItems ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (count <= 0) return null;

  return (
    <Link
      href={`/basket?kitchen=${kitchenId}`}
      className="animate-slide-in-right fixed right-5 bottom-28 z-30 flex h-17 w-17 items-center justify-center rounded-[20px] bg-[#FFFFFFCF] px-4 shadow-[0px_4px_30px_0px_#0000001A]"
      aria-label={`Basket — ${count} items`}
    >
      <div className="relative">
        <BasketIcon />
        <span className="absolute -top-2.5 -right-1 flex h-[20.666667938232422px] w-[20.666667938232422px] items-center justify-center rounded-full border-[1.55px] border-white bg-[#FA2A26] text-[10px] font-bold text-white">
          {count}
        </span>
      </div>
    </Link>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

import { StickyBar } from '@/components/features/sticky-bar';
import { BasketIcon } from '@/components/icons';
import { Spinner } from '@/components/ui/spinner';
import { Toast } from '@/components/ui/toast';
import type { Cart } from '@/lib/cart';

interface MealStickyBarProps {
  price: number;
  unit: string;
  qty?: number;
  kitchenId: string;
  /** Called on "Add to Basket" — resolves with the updated cart, or null on failure. */
  onAdd: () => Promise<Cart | null>;
}

export function MealStickyBar({ price, unit, qty = 1, kitchenId, onAdd }: MealStickyBarProps) {
  const [basketCount, setBasketCount] = useState(0);
  const [pending, setPending] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  async function handleAdd() {
    if (pending) return;
    setPending(true);
    const cart = await onAdd();
    setPending(false);

    if (cart) {
      setBasketCount(cart.totalItems);
    } else {
      setErrorVisible(true);
    }
  }

  return (
    <>
      {/* Floating basket button — appears above the sticky bar when items are added */}
      {basketCount > 0 && (
        <Link
          href={`/basket?kitchen=${kitchenId}`}
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
        actionLabel={
          pending ? (
            <Spinner className="h-5 w-5 border-2 border-white/30 border-t-white" />
          ) : (
            'Add to Basket'
          )
        }
        onAction={handleAdd}
      />

      {errorVisible && (
        <Toast
          message="Couldn't add to basket. Please try again."
          onClose={() => setErrorVisible(false)}
        />
      )}
    </>
  );
}

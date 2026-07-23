'use client';

import { useState } from 'react';

import { StickyBar } from '@/components/features/sticky-bar';
import { Spinner } from '@/components/ui/spinner';
import { Toast } from '@/components/ui/toast';
import type { Cart } from '@/lib/cart';

interface MealStickyBarProps {
  price: number;
  unit: string;
  qty?: number;
  /** Called on "Add to Basket" — resolves with the updated cart, or null on failure. */
  onAdd: () => Promise<Cart | null>;
  /** Called after a successful add, so the parent can refresh the shared floating basket. */
  onAdded?: () => void;
}

export function MealStickyBar({ price, unit, qty = 1, onAdd, onAdded }: MealStickyBarProps) {
  const [pending, setPending] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  async function handleAdd() {
    if (pending) return;
    setPending(true);
    const cart = await onAdd();
    setPending(false);

    if (cart) {
      onAdded?.();
    } else {
      setErrorVisible(true);
    }
  }

  return (
    <>
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

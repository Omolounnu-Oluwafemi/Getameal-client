'use client';

import { useState } from 'react';

import { MealExtrasCard } from './meal-extras-card';
import { MealStickyBar } from './meal-sticky-bar';
import { QuantitySheet } from './quantity-sheet';
import type { Extra } from '@/types';

interface MealDetailClientProps {
  basePrice: number;
  unit: string;
  extras: Extra[];
  /** Quantity carried over from the kitchen page's card controls. */
  initialQty?: number;
}

export function MealDetailClient({
  basePrice,
  unit,
  extras,
  initialQty = 1,
}: MealDetailClientProps) {
  const [activeExtra, setActiveExtra] = useState<Extra | null>(null);
  // Confirmed add-ons: extra id -> quantity.
  const [addedExtras, setAddedExtras] = useState<Record<string, number>>({});

  const extrasTotal = extras.reduce(
    (sum, extra) => sum + extra.price * (addedExtras[extra.id] ?? 0),
    0,
  );
  const displayPrice = basePrice * initialQty + extrasTotal;

  function confirmExtra(qty: number) {
    if (!activeExtra) return;
    const extraId = activeExtra.id;
    setAddedExtras((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[extraId];
        return next;
      }
      return { ...prev, [extraId]: qty };
    });
  }

  const activeExtraQty = activeExtra ? (addedExtras[activeExtra.id] ?? 0) : 0;

  return (
    <>
      <MealExtrasCard
        extras={extras}
        addedQtyById={addedExtras}
        onExtraSelect={setActiveExtra}
      />

      {activeExtra && (
        <QuantitySheet
          unit={unit}
          price={activeExtra.price}
          onClose={() => setActiveExtra(null)}
          onConfirm={confirmExtra}
          initialQty={Math.max(1, activeExtraQty)}
          minQty={activeExtraQty > 0 ? 0 : 1}
        />
      )}

      <MealStickyBar price={displayPrice} unit={unit} qty={initialQty} />
    </>
  );
}

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
}

export function MealDetailClient({ basePrice, unit, extras }: MealDetailClientProps) {
  const [activeExtra, setActiveExtra] = useState<Extra | null>(null);
  const [currentQty, setCurrentQty] = useState(1);

  const displayPrice = activeExtra ? activeExtra.price * currentQty : basePrice;

  function openSheet(extra: Extra) {
    setCurrentQty(1);
    setActiveExtra(extra);
  }

  function closeSheet() {
    setActiveExtra(null);
    setCurrentQty(1);
  }

  return (
    <>
      <MealExtrasCard extras={extras} onExtraSelect={openSheet} />

      {activeExtra && (
        <QuantitySheet
          unit={unit}
          price={activeExtra.price}
          onQtyChange={setCurrentQty}
          onClose={closeSheet}
          onConfirm={closeSheet}
        />
      )}

      <MealStickyBar price={displayPrice} unit={unit} />
    </>
  );
}

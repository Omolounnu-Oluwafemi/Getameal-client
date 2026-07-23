'use client';

import { useState } from 'react';

import { addToCart } from '@/lib/cart';
import type { Cart } from '@/lib/cart';
import { FloatingBasketButton } from './floating-basket-button';
import { MealExtrasCard } from './meal-extras-card';
import { MealStickyBar } from './meal-sticky-bar';
import { QuantitySheet } from './quantity-sheet';
import type { Extra } from '@/types';

interface MealDetailClientProps {
  productId: string;
  basePrice: number;
  unit: string;
  extras: Extra[];
  /** Quantity carried over from the kitchen page's card controls. */
  initialQty?: number;
  kitchenId: string;
}

export function MealDetailClient({
  productId,
  basePrice,
  unit,
  extras,
  initialQty = 1,
  kitchenId,
}: MealDetailClientProps) {
  const [activeExtra, setActiveExtra] = useState<Extra | null>(null);
  // Confirmed add-ons: extra id -> quantity.
  const [addedExtras, setAddedExtras] = useState<Record<string, number>>({});
  // Bumped after a successful add so the floating basket refetches the cart.
  const [basketRefreshKey, setBasketRefreshKey] = useState(0);

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

  function handleAddToBasket(): Promise<Cart | null> {
    // The cart API takes one { name, price } entry per add-on unit.
    const addOns = extras.flatMap((extra) =>
      Array.from({ length: addedExtras[extra.id] ?? 0 }, () => ({
        name: extra.name,
        price: extra.price,
      })),
    );
    return addToCart({ productId, quantity: initialQty, addOns });
  }

  const activeExtraQty = activeExtra ? (addedExtras[activeExtra.id] ?? 0) : 0;

  return (
    <>
      <MealExtrasCard extras={extras} addedQtyById={addedExtras} onExtraSelect={setActiveExtra} />

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

      <MealStickyBar
        price={displayPrice}
        unit={unit}
        qty={initialQty}
        onAdd={handleAddToBasket}
        onAdded={() => setBasketRefreshKey((k) => k + 1)}
      />
      <FloatingBasketButton kitchenId={kitchenId} refreshKey={basketRefreshKey} />
    </>
  );
}

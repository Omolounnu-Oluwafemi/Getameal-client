'use client';

import { useEffect, useState } from 'react';

import { Toast } from '@/components/ui/toast';
import { addToCart, getCart, removeFromCart } from '@/lib/cart';
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
  // Confirmed add-ons: extra id -> quantity.
  const [addedExtras, setAddedExtras] = useState<Record<string, number>>({});
  // Bumped after a successful add so the floating basket refetches the cart.
  const [basketRefreshKey, setBasketRefreshKey] = useState(0);

  const [qty, setQty] = useState(initialQty);
  const [qtySheetOpen, setQtySheetOpen] = useState(false);
  // True once this product is actually in the cart — swaps the sticky bar's
  // "Add to Basket" button for an inline +/- stepper.
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  // Reflect the real cart on load — this product may already be in there
  // from a previous visit or the kitchen grid, not just from this page.
  useEffect(() => {
    let cancelled = false;
    getCart().then((cart) => {
      if (cancelled) return;
      const existing = cart?.items.find((item) => item.productId === productId);
      if (existing) {
        setQty(existing.quantity);
        setAdded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const extrasTotal = extras.reduce(
    (sum, extra) => sum + extra.price * (addedExtras[extra.id] ?? 0),
    0,
  );
  const displayPrice = basePrice * qty + extrasTotal;

  function incrementExtra(extra: Extra) {
    setAddedExtras((prev) => ({ ...prev, [extra.id]: (prev[extra.id] ?? 0) + 1 }));
  }

  function decrementExtra(extra: Extra) {
    setAddedExtras((prev) => {
      const newQty = (prev[extra.id] ?? 0) - 1;
      const next = { ...prev };
      if (newQty <= 0) {
        delete next[extra.id];
      } else {
        next[extra.id] = newQty;
      }
      return next;
    });
  }

  function buildAddOns() {
    return extras.flatMap((extra) =>
      Array.from({ length: addedExtras[extra.id] ?? 0 }, () => ({
        name: extra.name,
        price: extra.price,
      })),
    );
  }

  // Tapping "Add to Basket" opens this sheet to confirm quantity — the actual
  // add-to-cart request only fires once the customer confirms here.
  async function handleConfirmQty(newQty: number) {
    setPending(true);

    const cart = await addToCart({ productId, quantity: newQty, addOns: buildAddOns() });
    setPending(false);

    if (cart) {
      setQty(newQty);
      setAdded(true);
      setBasketRefreshKey((k) => k + 1);
    } else {
      setErrorVisible(true);
    }
  }

  // Once added, +/- on the sticky bar adjusts the cart directly — no sheet.
  // No update endpoint yet — remove and re-add with the new quantity.
  async function handleStickyIncrement() {
    if (pending) return;
    setPending(true);

    const newQty = qty + 1;
    await removeFromCart(productId);
    const cart = await addToCart({ productId, quantity: newQty, addOns: buildAddOns() });
    setPending(false);

    if (cart) {
      setQty(newQty);
      setBasketRefreshKey((k) => k + 1);
    } else {
      setErrorVisible(true);
    }
  }

  async function handleStickyDecrement() {
    if (pending) return;
    setPending(true);

    const newQty = qty - 1;
    if (newQty <= 0) {
      const cart = await removeFromCart(productId);
      setPending(false);

      if (cart) {
        setQty(initialQty);
        setAdded(false);
        setBasketRefreshKey((k) => k + 1);
      } else {
        setErrorVisible(true);
      }
      return;
    }

    await removeFromCart(productId);
    const cart = await addToCart({ productId, quantity: newQty, addOns: buildAddOns() });
    setPending(false);

    if (cart) {
      setQty(newQty);
      setBasketRefreshKey((k) => k + 1);
    } else {
      setErrorVisible(true);
    }
  }

  return (
    <>
      <MealExtrasCard
        extras={extras}
        addedQtyById={addedExtras}
        onIncrement={incrementExtra}
        onDecrement={decrementExtra}
      />

      {qtySheetOpen && (
        <QuantitySheet
          unit={unit}
          price={basePrice}
          onClose={() => setQtySheetOpen(false)}
          onConfirm={handleConfirmQty}
          initialQty={qty}
          minQty={1}
        />
      )}

      <MealStickyBar
        price={displayPrice}
        unit={unit}
        qty={qty}
        added={added}
        pending={pending}
        onPress={() => setQtySheetOpen(true)}
        onIncrement={handleStickyIncrement}
        onDecrement={handleStickyDecrement}
      />
      <FloatingBasketButton kitchenId={kitchenId} refreshKey={basketRefreshKey} />

      {errorVisible && (
        <Toast
          message="Couldn't add to basket. Please try again."
          onClose={() => setErrorVisible(false)}
        />
      )}
    </>
  );
}

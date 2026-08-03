'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { CheckoutSheet } from '@/components/features/checkout-sheet';
import { KitchenMealCard } from '@/components/features/kitchen-meal-card';
import { MealExtrasCard } from '@/components/features/meal-extras-card';
import { StickyBar } from '@/components/features/sticky-bar';
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { Spinner } from '@/components/ui/spinner';
import { Toast } from '@/components/ui/toast';
import { addToCart, getCart, removeFromCart } from '@/lib/cart';
import type { Cart } from '@/lib/cart';
import type { Extra, KitchenMealItem } from '@/types';

interface BasketItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  addOns: { name: string; price: number }[];
  soldCount: number;
}

interface BasketClientProps {
  moreMeals: KitchenMealItem[];
  preparationDays: number;
  pickupWindow: string;
  kitchenId: string;
  deliveryFee: number;
  /** Shown for items without a photo — the cook's profile image or app icon. */
  fallbackImage: string;
  /** Each product's full extras catalog, keyed by product id. */
  productExtras: Record<string, Extra[]>;
  /** Each product's sold count, keyed by product id. */
  productSoldCount: Record<string, number>;
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

function mapCart(cart: Cart | null, productSoldCount: Record<string, number>): BasketItem[] {
  return (cart?.items ?? []).map((item) => ({
    // The cart keeps one line per product, so productId is the stable row id.
    id: item.productId,
    productId: item.productId,
    name: item.name,
    price: Math.round(item.customerPrice),
    qty: item.quantity,
    image: item.image,
    addOns: item.addOns.map((a) => ({ name: a.name, price: a.price })),
    soldCount: productSoldCount[item.productId] ?? 0,
  }));
}

export function BasketClient({
  moreMeals,
  preparationDays,
  pickupWindow,
  kitchenId,
  deliveryFee,
  fallbackImage,
  productExtras,
  productSoldCount,
}: BasketClientProps) {
  // null = still loading from the cart API.
  const [items, setItems] = useState<BasketItem[] | null>(null);
  const [pickupDay, setPickupDay] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPickupDay(
      new Date(Date.now() + preparationDays * 86_400_000).toLocaleDateString('en-NG', {
        weekday: 'long',
      }),
    );

    getCart().then((cart) => {
      if (cancelled) return;
      setItems(mapCart(cart, productSoldCount));
    });

    return () => {
      cancelled = true;
    };
  }, [preparationDays, productSoldCount]);

  async function changeQty(item: BasketItem, delta: number) {
    if (busyItemId) return;
    setBusyItemId(item.id);

    const newQty = item.qty + delta;
    let cart: Cart | null;
    if (newQty <= 0) {
      cart = await removeFromCart(item.productId);
    } else {
      // No update endpoint yet — remove and re-add with the new quantity so
      // the result is the same whether the POST increments or replaces.
      await removeFromCart(item.productId);
      cart = await addToCart({ productId: item.productId, quantity: newQty, addOns: item.addOns });
    }

    if (cart) {
      setItems(mapCart(cart, productSoldCount));
    } else {
      setErrorVisible(true);
    }
    setBusyItemId(null);
  }

  // One combined "Extras" list across every cart item's product catalog,
  // deduped by NAME (not id — the backend gives each product's add-ons their
  // own id even when two products both offer e.g. "Extra Chicken", so id-based
  // dedup let the same-named extra show up once per product). Each extra is
  // attributed to whichever cart item's product it was first seen on, so +/-
  // knows which cart line to update.
  const extraOwner = new Map<string, BasketItem>();
  const seenExtraNames = new Set<string>();
  const allExtras: Extra[] = [];
  for (const item of items ?? []) {
    for (const extra of productExtras[item.productId] ?? []) {
      if (!seenExtraNames.has(extra.name)) {
        seenExtraNames.add(extra.name);
        extraOwner.set(extra.name, item);
        allExtras.push(extra);
      }
    }
  }
  const addedExtraQtyById: Record<string, number> = {};
  for (const item of items ?? []) {
    for (const addOn of item.addOns) {
      const extra = allExtras.find((e) => e.name === addOn.name);
      if (extra) addedExtraQtyById[extra.id] = (addedExtraQtyById[extra.id] ?? 0) + 1;
    }
  }
  // Only extras actually in the order — removing one down to 0 drops it from
  // the list rather than leaving a bare "+" behind.
  const addedExtras = allExtras.filter((extra) => (addedExtraQtyById[extra.id] ?? 0) > 0);

  const EXTRAS_BUSY_KEY = '__extras__';

  async function changeExtraQty(extra: Extra, delta: 1 | -1) {
    if (busyItemId) return;
    const item = extraOwner.get(extra.name);
    if (!item) return;
    setBusyItemId(EXTRAS_BUSY_KEY);

    const addOns = [...item.addOns];
    if (delta > 0) {
      addOns.push({ name: extra.name, price: extra.price });
    } else {
      const idx = addOns.findIndex((a) => a.name === extra.name);
      if (idx !== -1) addOns.splice(idx, 1);
    }

    await removeFromCart(item.productId);
    const cart = await addToCart({ productId: item.productId, quantity: item.qty, addOns });

    if (cart) {
      setItems(mapCart(cart, productSoldCount));
    } else {
      setErrorVisible(true);
    }
    setBusyItemId(null);
  }

  const totalPrice = (items ?? []).reduce(
    (sum, item) => sum + item.price * item.qty + item.addOns.reduce((s, a) => s + a.price, 0),
    0,
  );
  const totalItems = (items ?? []).reduce((sum, item) => sum + item.qty, 0);
  const cartQtyById = Object.fromEntries((items ?? []).map((item) => [item.productId, item.qty]));
  // Meals already in the basket don't need to be suggested again.
  const suggestedMeals = moreMeals.filter((meal) => !cartQtyById[meal.id]);

  return (
    <>
      {/* Blocking overlay while a cart change is in flight */}
      {busyItemId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px]"
          aria-busy="true"
        >
          <Spinner />
        </div>
      )}

      {checkoutOpen && (
        <CheckoutSheet
          onClose={() => setCheckoutOpen(false)}
          kitchenId={kitchenId}
          deliveryFee={deliveryFee}
        />
      )}
      <div className="min-h-screen bg-white pb-32">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-[#FFFFFFE5] px-5 pt-[max(2rem,calc(env(safe-area-inset-top)+0.5rem))] pb-5 backdrop-blur-[20px]">
          <h1 className="text-2xl font-bold text-black">Your Basket</h1>
          <Link
            href={`/${kitchenId}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white"
            aria-label="Close basket"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M11 3L3 11M3 3l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>

        <div className="space-y-5 px-5">
          {/* Pickup info */}
          <div className="flex items-center gap-2 rounded-[20px] border border-[#EDEDED] bg-white px-5 py-4 shadow-[0px_10px_20px_0px_#0000000D]">
            <Image src="/images/pickup-icon.svg" alt="Pickup" width={60} height={49} />
            <div>
              <p className="text-base font-semibold text-black">Ready for pickup on {pickupDay}</p>
              <p className="text-sm text-[#5C5C5C]">Pick up window - {pickupWindow}</p>
            </div>
          </div>

          {/* Cart items */}
          {items === null ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <p className="text-base font-semibold text-black">Your basket is empty</p>
              <Link href={`/${kitchenId}`} className="text-brand text-sm font-semibold">
                Browse the kitchen
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  busy={busyItemId === item.id}
                  fallbackImage={fallbackImage}
                  onChangeQty={changeQty}
                />
              ))}
            </div>
          )}

          {/* Extras — combined across every item in the basket */}
          {addedExtras.length > 0 && (
            <MealExtrasCard
              extras={addedExtras}
              addedQtyById={addedExtraQtyById}
              onIncrement={(extra) => changeExtraQty(extra, 1)}
              onDecrement={(extra) => changeExtraQty(extra, -1)}
            />
          )}

          {/* More from this seller */}
          {suggestedMeals.length > 0 && (
            <div className="pt-2">
              <h2 className="mb-4 text-base font-semibold text-black">More from this seller</h2>
              <div className="-mx-5 flex scrollbar-none gap-3 overflow-x-auto px-5 pb-2">
                {suggestedMeals.map((meal) => (
                  <div key={meal.id} className="w-47.75 shrink-0">
                    <KitchenMealCard meal={meal} isKitchenOpen kitchenId={kitchenId} cartQty={0} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <StickyBar
          amount={totalPrice}
          caption={`${totalItems} ${totalItems === 1 ? 'Item' : 'Items'} added`}
          onAction={() => setCheckoutOpen(true)}
          actionLabel={
            <>
              Go to checkout
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          }
        />

        {errorVisible && (
          <Toast
            message="Couldn't update your basket. Please try again."
            onClose={() => setErrorVisible(false)}
          />
        )}
      </div>
    </>
  );
}

function CartItemRow({
  item,
  busy,
  fallbackImage,
  onChangeQty,
}: {
  item: BasketItem;
  busy: boolean;
  fallbackImage: string;
  onChangeQty: (item: BasketItem, delta: number) => void;
}) {
  const imageSrc = item.image?.startsWith('https://res.cloudinary.com/')
    ? item.image
    : fallbackImage;

  return (
    <div className="flex items-center gap-3 py-3">
      <Image
        src={imageSrc}
        alt={item.name}
        width={107}
        height={98}
        className="h-24.5 w-26.75 shrink-0 rounded-2xl object-cover shadow-[0px_4px_20px_0px_#00000026]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 self-start">
          <p className="text-sm leading-tight font-medium text-black">{item.name}</p>
          <p className="text-sm font-medium text-[#209D01]">{item.soldCount} Sold</p>
        </div>

        <div className="flex items-center justify-between gap-1 pt-2">
          <p className="text-base font-bold text-black">{fmt(item.price)}</p>
          <div
            className={`flex h-9.5 w-21.25 items-center justify-between rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D] ${busy ? 'opacity-50' : ''}`}
          >
            <button
              onClick={() => onChangeQty(item, -1)}
              disabled={busy}
              className="flex h-5 w-5 items-center justify-center text-black"
              aria-label="Decrease"
            >
              {item.qty === 1 ? (
                <TrashIcon className="h-4 w-4" />
              ) : (
                <MinusIcon className="h-4 w-4" />
              )}
            </button>
            <span className="min-w-4 text-center text-sm font-bold text-black">{item.qty}</span>
            <button
              onClick={() => onChangeQty(item, 1)}
              disabled={busy}
              className="flex h-5 w-5 items-center justify-center text-black"
              aria-label="Increase"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

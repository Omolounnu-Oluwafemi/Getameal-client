'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { CheckoutSheet } from '@/components/features/checkout-sheet';
import { KitchenMealCard } from '@/components/features/kitchen-meal-card';
import { StickyBar } from '@/components/features/sticky-bar';
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/icons';
import type { StaticImageData } from 'next/image';
import type { KitchenMealItem } from '@/types';

interface CartItem {
  id: string;
  name: string;
  sold: number;
  price: number;
  unit: string;
  qty: number;
  image: StaticImageData;
}

interface BasketClientProps {
  initialItems: CartItem[];
  moreMeals: KitchenMealItem[];
  pickupDay: string;
  pickupWindow: string;
}

export function BasketClient({
  initialItems,
  moreMeals,
  pickupDay,
  pickupWindow,
}: BasketClientProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function changeQty(id: string, delta: number) {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    );
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {checkoutOpen && <CheckoutSheet onClose={() => setCheckoutOpen(false)} />}
      <div className="min-h-screen bg-white pb-32">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-[#FFFFFFE5] px-5 pt-[max(2rem,calc(env(safe-area-inset-top)+0.5rem))] pb-5 backdrop-blur-[20px]">
          <h1 className="text-2xl font-bold text-black">Your Basket</h1>
          <Link
            href="/meals/m1"
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
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} onChangeQty={changeQty} />
            ))}
          </div>

          {/* More from this seller */}
          {moreMeals.length > 0 && (
            <div className="pt-2">
              <h2 className="mb-4 text-base font-semibold text-black">More from this seller</h2>
              <div className="-mx-5 flex scrollbar-none gap-3 overflow-x-auto px-5 pb-2">
                {moreMeals.map((meal) => (
                  <div key={meal.id} className="w-47.75 shrink-0">
                    <KitchenMealCard meal={meal} isKitchenOpen />
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
      </div>
    </>
  );
}

function CartItemRow({
  item,
  onChangeQty,
}: {
  item: CartItem;
  onChangeQty: (id: string, delta: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Image
        src={item.image}
        alt={item.name}
        width={107}
        height={98}
        className="h-24.5 w-26.75 shrink-0 rounded-2xl object-cover shadow-[0px_4px_20px_0px_#00000026]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 self-start">
          <p className="text-sm leading-tight font-medium text-black">{item.name}</p>
          <p className="text-sm font-medium text-[#209D01]">{item.sold} Sold</p>
        </div>

        <div className="flex items-center justify-between gap-1 pt-2">
          <p className="text-base font-bold text-black">
            {`₦${item.price.toLocaleString('en-NG')}`}
            <span className="text-base font-semibold text-black"> / 1 {item.unit}</span>
          </p>
          <div className="flex h-9.5 w-21.25 items-center justify-between rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D]">
            <button
              onClick={() => onChangeQty(item.id, -1)}
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
              onClick={() => onChangeQty(item.id, 1)}
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

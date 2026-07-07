'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CheckoutSheet } from '@/components/features/checkout-sheet';
import type { StaticImageData } from 'next/image';

interface CartItem {
  id: string;
  name: string;
  sold: number;
  price: number;
  unit: string;
  qty: number;
  image: StaticImageData;
}

interface MoreMeal {
  id: string;
  name: string;
  image: StaticImageData;
  price: number;
  badge?: string;
}

interface BasketClientProps {
  initialItems: CartItem[];
  moreMeals: MoreMeal[];
  pickupDay: string;
  pickupWindow: string;
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export function BasketClient({ initialItems, moreMeals, pickupDay, pickupWindow }: BasketClientProps) {
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
      <div className="flex items-center justify-between px-5 pt-14 pb-5">
        <h1 className="text-2xl font-bold text-black">Your Basket</h1>
        <Link
          href="/meals/m1"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white"
          aria-label="Close basket"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      <div className="space-y-5 px-5">
        {/* Pickup info */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#EDEDED] bg-white p-4 shadow-[0px_4px_20px_0px_#0000000D]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 8h14M5 8a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v.01a2 2 0 01-2 2M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8"
                stroke="#5C5C5C"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Ready for pickup on {pickupDay}</p>
            <p className="text-xs text-neutral-500">Pick up window - {pickupWindow}</p>
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
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {moreMeals.map((meal) => (
                <Link
                  key={meal.id}
                  href={`/meals/${meal.id}`}
                  className="relative flex-shrink-0 w-44 overflow-hidden rounded-2xl"
                >
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <Image src={meal.image} alt={meal.name} fill className="object-cover" />
                    {meal.badge && (
                      <span className="absolute top-2 left-2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-black">
                        {meal.badge}
                      </span>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-black line-clamp-1">{meal.name}</p>
                    <p className="text-sm font-bold text-black">{fmt(meal.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-white px-5 pb-10 pt-4 shadow-[0px_-4px_20px_0px_#0000001A]">
        <div>
          <p className="text-xl font-bold text-black">{fmt(totalPrice)}</p>
          <p className="text-xs text-neutral-500">{totalItems} {totalItems === 1 ? 'Item' : 'Items'} added</p>
        </div>
        <Button
          variant="brand"
          onClick={() => setCheckoutOpen(true)}
          className="flex h-13 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold"
        >
          Go to checkout
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </div>
    </>
  );
}

function CartItemRow({ item, onChangeQty }: { item: CartItem; onChangeQty: (id: string, delta: number) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#EDEDED] bg-white p-3 shadow-[0px_4px_20px_0px_#0000000D]">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-xs font-semibold text-[#209D01]">{item.sold} Sold</p>
        <p className="text-sm font-semibold text-black leading-tight">{item.name}</p>
        <p className="text-sm font-bold text-black">
          {`₦${item.price.toLocaleString('en-NG')}`}
          <span className="text-xs font-normal text-neutral-500"> / 1 {item.unit}</span>
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChangeQty(item.id, -1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDEDED] text-neutral-700"
          aria-label="Decrease"
        >
          {item.qty === 1 ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 10a1 1 0 001 1h6a1 1 0 001-1l1-10"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="text-base leading-none">−</span>
          )}
        </button>
        <span className="min-w-5 text-center text-sm font-semibold text-black">{item.qty}</span>
        <button
          onClick={() => onChangeQty(item.id, 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDEDED] text-neutral-700"
          aria-label="Increase"
        >
          <span className="text-base leading-none">+</span>
        </button>
      </div>
    </div>
  );
}

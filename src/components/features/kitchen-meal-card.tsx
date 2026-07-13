'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon, TrashIcon } from '@/components/icons';
import { Toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type { KitchenMealItem } from '@/types';

interface KitchenMealCardProps {
  meal: KitchenMealItem;
  isKitchenOpen: boolean;
  kitchenId: string;
}

export function KitchenMealCard({ meal, isKitchenOpen, kitchenId }: KitchenMealCardProps) {
  const [qty, setQty] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);

  const formatted = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

  function add() {
    if (isKitchenOpen) {
      setQty(1);
    } else {
      setToastVisible(true);
    }
  }

  return (
    <article className="relative flex flex-col gap-2.75 overflow-hidden rounded-[20px]">
      {/* Full-card link to the meal detail page */}
      <Link
        href={`/meals/${meal.id}?kitchen=${kitchenId}${qty > 0 ? `&qty=${qty}` : ''}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${meal.name}`}
      />
      {/* Image */}
      <div className="relative h-50 w-full overflow-hidden rounded-[20px] bg-neutral-100 shadow-[0px_4px_20px_0px_#00000029]">
        <Image
          src={meal.imageUrl}
          alt={meal.name}
          width={199}
          height={200}
          className="h-full w-full rounded-[20px] object-cover"
        />

        {/* Popular badge */}
        {meal.popular && (
          <div className="absolute top-2 left-2">
            <span className="flex h-7.5 w-18 items-center justify-center rounded-[80px] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-neutral-900">
              Popular
            </span>
          </div>
        )}

        {/* Quantity controls — z-20 so they sit above the card link */}
        <div className="absolute right-2 bottom-2 z-20" onClick={(e) => e.preventDefault()}>
          {qty === 0 ? (
            <button
              onClick={add}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#EDEDED] p-2.5 shadow-[0px_4px_15px_0px_#0000000D]',
                isKitchenOpen ? 'bg-white' : 'bg-[#C3C3C3]',
              )}
              aria-label={`Add ${meal.name}`}
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex h-9.5 w-21.25 items-center justify-between rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D]">
              <button
                onClick={() => setQty((q) => Math.max(0, q - 1))}
                className="flex h-6 w-6 items-center justify-center text-neutral-500 hover:text-neutral-800"
                aria-label={qty === 1 ? 'Remove item' : 'Decrease quantity'}
              >
                {qty === 1 ? (
                  <TrashIcon className="h-4.5 w-4.5" />
                ) : (
                  <span className="text-lg leading-none text-[#000000]">−</span>
                )}
              </button>
              <span className="min-w-4 text-center text-sm font-bold text-[#000000]">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-6 w-6 items-center justify-center text-neutral-500 hover:text-neutral-800"
                aria-label="Increase quantity"
              >
                <span className="text-lg leading-none text-[#000000]">+</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-1 pb-2">
        <p className="truncate pb-1 text-base font-semibold text-[#000000]">{meal.name}</p>
        <p className="pb-2 text-sm font-medium text-[#209D01]">{meal.soldCount} Sold</p>
        <p className="font-inter text-base leading-none font-bold text-black">
          {formatted(meal.price)}
          <span className="text-xs font-bold text-[#000000]">/{meal.unit}</span>
        </p>
      </div>

      {toastVisible && (
        <Toast
          message="This seller is closed for today please check back later"
          onClose={() => setToastVisible(false)}
        />
      )}
    </article>
  );
}

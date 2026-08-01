'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { Toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type { KitchenMealItem } from '@/types';

interface KitchenMealCardProps {
  meal: KitchenMealItem;
  isKitchenOpen: boolean;
  kitchenId: string;
  /** Quantity of this product already in the basket, if any. */
  cartQty?: number;
  /**
   * Adjust an already-added item's quantity in place, no navigation. Omit to
   * fall back to a plain count badge (used where there's no cart-mutation
   * context, e.g. the basket page's "More from this seller" strip). The
   * first add always happens on the meal detail page, never from the grid.
   */
  onIncrement?: (meal: KitchenMealItem) => void;
  onDecrement?: (meal: KitchenMealItem) => void;
  /** Disables the quantity controls while a cart request is in flight. */
  busy?: boolean;
}

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export function KitchenMealCard({
  meal,
  isKitchenOpen,
  kitchenId,
  cartQty = 0,
  onIncrement,
  onDecrement,
  busy = false,
}: KitchenMealCardProps) {
  // Sold-count isn't returned by the store API yet (always 0), so this stays
  // ready for real data without any product actually showing Popular yet.
  const popular = meal.soldCount >= 10;
  // A closed kitchen makes every meal unavailable too, not just ones flagged
  // individually — same badge either way, but the toast explains which.
  const unavailable = !isKitchenOpen || !meal.isAvailable;
  const [unavailableMessage, setUnavailableMessage] = useState<string | null>(null);

  function showUnavailable(e: React.MouseEvent) {
    e.preventDefault();
    setUnavailableMessage(
      !isKitchenOpen
        ? 'This seller is closed for today. Please check back later.'
        : `${meal.name} is currently unavailable.`,
    );
  }

  return (
    <article className="relative flex flex-col gap-2.75 overflow-hidden rounded-[20px]">
      {/* Full-card link to the meal detail page — the "+" below leads to the
          same place; adding now happens on that page, not from the grid.
          Unavailable meals stay clickable but surface a toast instead. */}
      {!unavailable ? (
        <Link
          href={`/meals/${meal.id}?kitchen=${kitchenId}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${meal.name}`}
        />
      ) : (
        <button
          type="button"
          onClick={showUnavailable}
          className="absolute inset-0 z-10"
          aria-label={`${meal.name} — unavailable`}
        />
      )}
      {/* Image */}
      <div className="relative h-50 w-full overflow-hidden rounded-[20px] bg-neutral-100 shadow-[0px_4px_20px_0px_#00000029]">
        <Image
          src={meal.imageUrl}
          alt={meal.name}
          width={199}
          height={200}
          className="h-full w-full rounded-[20px] object-cover"
        />

        {/* Unavailable takes priority over Popular in this same badge slot. */}
        {unavailable ? (
          <div className="absolute top-2 left-2">
            <span className="flex h-7.5 items-center justify-center rounded-[80px] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-neutral-900">
              Unavailable
            </span>
          </div>
        ) : (
          popular && (
            <div className="absolute top-2 left-2">
              <span className="flex h-7.5 w-18 items-center justify-center rounded-[80px] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-neutral-900">
                Popular
              </span>
            </div>
          )
        )}

        {unavailable ? (
          <button
            type="button"
            onClick={showUnavailable}
            aria-label={`${meal.name} — unavailable`}
            className="absolute right-2 bottom-2 z-20 flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D]"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        ) : cartQty === 0 || !onIncrement || !onDecrement ? (
          <Link
            href={`/meals/${meal.id}?kitchen=${kitchenId}`}
            aria-label={
              cartQty > 0
                ? `${meal.name} — ${cartQty} in basket, view to change`
                : `View ${meal.name}`
            }
            className="absolute right-2 bottom-2 z-20 flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D]"
          >
            {cartQty > 0 ? (
              <span className="text-sm font-bold text-black">{cartQty}</span>
            ) : (
              <PlusIcon className="h-5 w-5" />
            )}
          </Link>
        ) : (
          <div
            className={cn(
              'absolute right-2 bottom-2 z-20 flex h-10 w-21.25 items-center justify-between rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D]',
              busy && 'opacity-50',
            )}
          >
            <button
              type="button"
              onClick={() => onDecrement(meal)}
              disabled={busy}
              className="flex h-5 w-5 items-center justify-center text-black"
              aria-label={cartQty === 1 ? `Remove ${meal.name}` : `Decrease ${meal.name}`}
            >
              {cartQty === 1 ? (
                <TrashIcon className="h-4 w-4" />
              ) : (
                <MinusIcon className="h-4 w-4" />
              )}
            </button>
            <span className="min-w-4 text-center text-sm font-bold text-black">{cartQty}</span>
            <button
              type="button"
              onClick={() => onIncrement(meal)}
              disabled={busy}
              className="flex h-5 w-5 items-center justify-center text-black"
              aria-label={`Increase ${meal.name}`}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1 pb-2">
        <p className="truncate pb-1 text-base font-semibold text-[#000000]">{meal.name}</p>
        <p className="pb-2 text-sm font-medium text-[#209D01]">{meal.soldCount} Sold</p>
        <p className="font-inter text-base leading-none font-bold text-black">
          {fmt(meal.price)}
          <span className="text-xs font-bold text-[#000000]">/{meal.unit}</span>
        </p>
      </div>

      {unavailableMessage && (
        <Toast message={unavailableMessage} onClose={() => setUnavailableMessage(null)} />
      )}
    </article>
  );
}

'use client';

import { MinusIcon, PlusIcon } from '@/components/icons';
import { StickyBar } from '@/components/features/sticky-bar';
import { Spinner } from '@/components/ui/spinner';

interface MealStickyBarProps {
  price: number;
  unit: string;
  qty?: number;
  /** True once the item is already in the cart — swaps the button for a stepper. */
  added?: boolean;
  /** True while a cart request (initial add, or +/- from the stepper) is in flight. */
  pending?: boolean;
  /** Opens the quantity sheet — only used before the first add. */
  onPress: () => void;
  /** Adjust the already-added item's quantity in place, no sheet. */
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function MealStickyBar({
  price,
  unit,
  qty = 1,
  added = false,
  pending = false,
  onPress,
  onIncrement,
  onDecrement,
}: MealStickyBarProps) {
  return (
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
      onAction={onPress}
      rightSlot={
        added ? (
          <div className="ml-auto flex h-13 items-center justify-between gap-3 rounded-[50px] border border-[#EDEDED] bg-white px-5">
            <button
              type="button"
              onClick={onDecrement}
              disabled={pending}
              className="flex h-6 w-6 items-center justify-center text-black disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="min-w-16 text-center text-sm font-semibold whitespace-nowrap text-black">
              {pending ? (
                <Spinner className="mx-auto h-4 w-4 border-2 border-neutral-300 border-t-black" />
              ) : (
                `${qty} ${unit}`
              )}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              disabled={pending}
              className="flex h-6 w-6 items-center justify-center text-black disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        ) : undefined
      }
    />
  );
}

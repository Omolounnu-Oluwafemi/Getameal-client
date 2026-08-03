'use client';

import { MinusIcon, PlusIcon, TrashIcon } from '@/components/icons';
import type { Extra } from '@/types';

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

interface MealExtrasCardProps {
  extras: Extra[];
  /** Confirmed quantity per extra id. */
  addedQtyById?: Record<string, number>;
  onIncrement: (extra: Extra) => void;
  onDecrement: (extra: Extra) => void;
}

export function MealExtrasCard({
  extras,
  addedQtyById = {},
  onIncrement,
  onDecrement,
}: MealExtrasCardProps) {
  return (
    <section className="rounded-[20px] border-[0.73px] border-[#E1E1E1] bg-white px-5 py-6 shadow-[0px_4px_20px_0px_#0000000D]">
      <h2 className="font-poppins mb-3 text-base leading-5.5 font-semibold text-black">Extras</h2>
      <div className="mb-4 h-px bg-[#E1E1E1]" />
      <ul className="space-y-2.5">
        {extras.map((extra, i) => {
          const qty = addedQtyById[extra.id] ?? 0;
          return (
            <li
              key={extra.id}
              className={`flex items-center justify-between ${
                i < extras.length - 1 ? 'border-neutral-100 pb-2.5' : ''
              }`}
            >
              <span className="font-inter text-sm leading-[15.6px] font-medium text-neutral-800">
                {extra.name}{' '}
                <span className="font-inter text-sm leading-[15.6px] font-bold text-black">
                  (+ {fmt(extra.price)})
                </span>
              </span>

              {qty > 0 ? (
                <div className="flex h-9 w-21.25 items-center justify-between rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D]">
                  <button
                    type="button"
                    onClick={() => onDecrement(extra)}
                    className="flex h-5 w-5 items-center justify-center text-black"
                    aria-label={qty === 1 ? `Remove ${extra.name}` : `Decrease ${extra.name}`}
                  >
                    {qty === 1 ? (
                      <TrashIcon className="h-4 w-4" />
                    ) : (
                      <MinusIcon className="h-4 w-4" />
                    )}
                  </button>
                  <span className="min-w-4 text-center text-sm font-bold text-black">{qty}</span>
                  <button
                    type="button"
                    onClick={() => onIncrement(extra)}
                    className="flex h-5 w-5 items-center justify-center text-black"
                    aria-label={`Increase ${extra.name}`}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onIncrement(extra)}
                  className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D] transition-colors hover:bg-neutral-50"
                  aria-label={`Add ${extra.name}`}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

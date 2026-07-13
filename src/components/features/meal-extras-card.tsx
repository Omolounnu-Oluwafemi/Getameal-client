'use client';

import { PlusIcon } from '@/components/icons';
import type { Extra } from '@/types';

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

interface MealExtrasCardProps {
  extras: Extra[];
  /** Confirmed quantity per extra id — added extras show a count badge. */
  addedQtyById?: Record<string, number>;
  onExtraSelect: (extra: Extra) => void;
}

export function MealExtrasCard({ extras, addedQtyById = {}, onExtraSelect }: MealExtrasCardProps) {
  return (
    <section className="rounded-[20px] border-[0.73px] border-[#EDEDED] bg-white px-5 py-6 shadow-[0px_4px_20px_0px_#0000000D]">
      <h2 className="font-poppins mb-3 text-base leading-5.5 font-semibold text-black">Extras</h2>
      <ul className="space-y-3">
        {extras.map((extra, i) => (
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
            <button
              onClick={() => onExtraSelect(extra)}
              className={`flex h-9 w-9 items-center justify-center rounded-[14px] border p-2.5 shadow-[0px_4px_15px_0px_#0000000D] transition-colors ${
                addedQtyById[extra.id]
                  ? 'border-brand bg-brand text-white'
                  : 'border-[#EDEDED] bg-white hover:bg-neutral-50'
              }`}
              aria-label={
                addedQtyById[extra.id]
                  ? `Edit ${extra.name} (${addedQtyById[extra.id]} added)`
                  : `Add ${extra.name}`
              }
            >
              {addedQtyById[extra.id] ? (
                <span className="text-sm font-bold">{addedQtyById[extra.id]}</span>
              ) : (
                <PlusIcon className="h-4 w-4" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

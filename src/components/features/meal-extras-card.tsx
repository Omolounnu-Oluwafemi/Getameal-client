'use client';

import { PlusIcon } from '@/components/icons';
import type { Extra } from '@/types';

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

interface MealExtrasCardProps {
  extras: Extra[];
  onExtraSelect: (extra: Extra) => void;
}

export function MealExtrasCard({ extras, onExtraSelect }: MealExtrasCardProps) {
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
              className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[#EDEDED] bg-white p-2.5 shadow-[0px_4px_15px_0px_#0000000D] transition-colors hover:bg-neutral-50"
              aria-label={`Add ${extra.name}`}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

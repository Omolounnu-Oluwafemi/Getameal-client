import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { KitchenMealItem } from '@/types';

interface KitchenMealCardProps {
  meal: KitchenMealItem;
  isKitchenOpen: boolean;
  kitchenId: string;
  /** Quantity of this product already in the basket, if any. */
  cartQty?: number;
}

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export function KitchenMealCard({
  meal,
  isKitchenOpen,
  kitchenId,
  cartQty = 0,
}: KitchenMealCardProps) {
  return (
    <article className="relative flex flex-col gap-2.75 overflow-hidden rounded-[20px]">
      {/* Full-card link to the meal detail page — the "+" below leads to the
          same place; adding now happens on that page, not from the grid. */}
      <Link
        href={`/meals/${meal.id}?kitchen=${kitchenId}`}
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

        <Link
          href={`/meals/${meal.id}?kitchen=${kitchenId}`}
          aria-label={cartQty > 0 ? `${meal.name} — ${cartQty} in basket, view to change` : `View ${meal.name}`}
          className={cn(
            'absolute right-2 bottom-2 z-20 flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#EDEDED] p-2.5 shadow-[0px_4px_15px_0px_#0000000D]',
            isKitchenOpen ? 'bg-white' : 'bg-[#C3C3C3]',
          )}
        >
          {cartQty > 0 ? (
            <span className="text-sm font-bold text-black">{cartQty}</span>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
        </Link>
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
    </article>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { KitchenMealCard } from './kitchen-meal-card';
import type { KitchenCategory, KitchenMealItem } from '@/types';

interface KitchenMealGridProps {
  categories: KitchenCategory[];
  meals: KitchenMealItem[];
  isKitchenOpen: boolean;
  kitchenId: string;
}

export function KitchenMealGrid({
  categories,
  meals,
  isKitchenOpen,
  kitchenId,
}: KitchenMealGridProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const filtered =
    activeCategoryId !== null ? meals.filter((m) => m.category === activeCategoryId) : meals;

  function toggleCategory(id: string) {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="pb-8">
      {/* Category chip row */}
      <div className="mb-4 flex scrollbar-none gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border pt-2 pr-4 pb-2 pl-2.5 text-sm font-semibold transition-colors',
              activeCategoryId === cat.id
                ? 'border-brand bg-brand text-white'
                : 'border-[#EDEDED] bg-white text-neutral-700 hover:bg-neutral-50',
            )}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              width={26}
              height={24}
              className="rounded-sm object-cover"
            />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((meal) => (
          <KitchenMealCard
            key={meal.id}
            meal={meal}
            isKitchenOpen={isKitchenOpen}
            kitchenId={kitchenId}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-neutral-400">No items in this category yet.</p>
      )}
    </div>
  );
}

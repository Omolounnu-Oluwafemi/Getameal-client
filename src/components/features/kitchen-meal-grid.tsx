'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';

import soupsImg from '../../../public/images/categories/soups.png';
import ricePastaImg from '../../../public/images/categories/rice-pasta.png';
import stewSauceImg from '../../../public/images/categories/stew-sauce.png';
import proteinGrillsImg from '../../../public/images/categories/protein-grills.png';
import specialDietsImg from '../../../public/images/categories/special-diets.png';
import pastriesImg from '../../../public/images/categories/pastries.png';

import { addToCart, getCart, removeFromCart } from '@/lib/cart';
import { EmptyMealsState } from './empty-meals-state';
import { KitchenMealCard } from './kitchen-meal-card';
import type { KitchenMealItem } from '@/types';

interface KitchenMealGridProps {
  meals: KitchenMealItem[];
  isKitchenOpen: boolean;
  kitchenId: string;
  /** Filters the grid by dish name — fed by the header's search field. */
  searchQuery?: string;
  /** Pixel height of the sticky header above, so the category row sticks right below it. */
  stickyOffset: number;
}

/**
 * The backend only gives products an opaque category ObjectId, no name — so
 * there's no real category data to render chips from. This is a fixed set of
 * cuisine categories matched against the dish name as a best-effort filter,
 * until the backend returns real category names per product.
 */
interface CuisineCategory {
  id: string;
  name: string;
  image: StaticImageData;
  keywords: string[];
}

const CATEGORIES: CuisineCategory[] = [
  { id: 'soups', name: 'Soups', image: soupsImg, keywords: ['soup'] },
  {
    id: 'rice-pasta',
    name: 'Rice & Pasta',
    image: ricePastaImg,
    keywords: ['rice', 'pasta', 'spaghetti', 'noodle', 'jollof'],
  },
  {
    id: 'stew-sauce',
    name: 'Stew & Sauce',
    image: stewSauceImg,
    keywords: ['stew', 'sauce', 'ofada'],
  },
  {
    id: 'protein-grills',
    name: 'Protein & grills',
    image: proteinGrillsImg,
    keywords: ['grill', 'suya', 'chicken', 'beef', 'meat', 'fish', 'kebab', 'turkey', 'goat'],
  },
  {
    id: 'special-diets',
    name: 'Special diets',
    image: specialDietsImg,
    keywords: ['salad', 'vegan', 'vegetarian', 'keto', 'healthy', 'diet'],
  },
  {
    id: 'pastries',
    name: 'Pastries',
    image: pastriesImg,
    keywords: ['pastry', 'pastries', 'cake', 'pancake', 'bread', 'puff', 'meat pie'],
  },
];

export function KitchenMealGrid({
  meals,
  isKitchenOpen,
  kitchenId,
  searchQuery = '',
  stickyOffset,
}: KitchenMealGridProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  // productId -> quantity already in the basket, so cards show the stepper
  // instead of "+" for items the customer already has.
  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});
  const [busyProductId, setBusyProductId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCart().then((cart) => {
      if (cancelled || !cart) return;
      const next: Record<string, number> = {};
      for (const item of cart.items) next[item.productId] = item.quantity;
      setCartQtyById(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId);
  const byCategory = activeCategory
    ? meals.filter((m) => {
        const name = m.name.toLowerCase();
        return activeCategory.keywords.some((k) => name.includes(k));
      })
    : meals;
  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? byCategory.filter((m) => m.name.toLowerCase().includes(query))
    : byCategory;

  function toggleCategory(id: string) {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  }

  async function handleIncrement(meal: KitchenMealItem) {
    if (busyProductId) return;
    setBusyProductId(meal.id);

    const newQty = (cartQtyById[meal.id] ?? 0) + 1;
    // No update endpoint yet — remove and re-add with the new quantity.
    await removeFromCart(meal.id);
    const cart = await addToCart({ productId: meal.id, quantity: newQty, addOns: [] });
    if (cart) setCartQtyById((prev) => ({ ...prev, [meal.id]: newQty }));
    setBusyProductId(null);
  }

  async function handleDecrement(meal: KitchenMealItem) {
    if (busyProductId) return;
    setBusyProductId(meal.id);

    const newQty = (cartQtyById[meal.id] ?? 0) - 1;
    if (newQty <= 0) {
      const cart = await removeFromCart(meal.id);
      if (cart) setCartQtyById((prev) => ({ ...prev, [meal.id]: 0 }));
    } else {
      await removeFromCart(meal.id);
      const cart = await addToCart({ productId: meal.id, quantity: newQty, addOns: [] });
      if (cart) setCartQtyById((prev) => ({ ...prev, [meal.id]: newQty }));
    }
    setBusyProductId(null);
  }

  if (meals.length === 0) {
    return (
      <EmptyMealsState
        heading="Nothing cooking yet"
        subtext="This cook has not published any meals yet. Check back soon for their next menu."
      />
    );
  }

  return (
    <div className="pb-8">
      {/* Category chip row — sticks right below the header once scrolled up to it. */}
      <div
        className="sticky z-100 mb-4 flex scrollbar-none gap-2 overflow-x-auto bg-white pb-2"
        style={{ top: stickyOffset }}
      >
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="relative shrink-0 pb-4">
            <button
              onClick={() => toggleCategory(cat.id)}
              className="flex items-center gap-1.5 rounded-full border border-[#EDEDED] bg-white px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-neutral-900 shadow-[0px_4px_20px_0px_#0000000D] transition-colors hover:bg-neutral-50"
            >
              <Image
                src={cat.image}
                alt=""
                width={26}
                height={24}
                className="rounded-sm object-cover"
              />
              {cat.name}
            </button>
            {activeCategoryId === cat.id && (
              <div className="bg-brand absolute inset-x-6 bottom-0 h-1.5 rounded-full" />
            )}
          </div>
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
            cartQty={cartQtyById[meal.id] ?? 0}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            busy={busyProductId === meal.id}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyMealsState
          heading={query ? 'No dishes found' : 'Nothing here yet'}
          subtext={
            query
              ? 'No dishes match your search. Try a different keyword.'
              : 'No dishes in this category yet. Try another one.'
          }
        />
      )}
    </div>
  );
}

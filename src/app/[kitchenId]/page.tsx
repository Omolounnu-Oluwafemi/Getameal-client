import Image from 'next/image';

import avatarImg from '../../../public/images/kitchen/avatar.png';
import bannerImg from '../../../public/images/kitchen/banner.jpg';
import friedRiceImg from '../../../public/images/kitchen/fried-rice-special.png';
import meatPlaterImg from '../../../public/images/kitchen/meat-plater.png';
import soupImg from '../../../public/images/kitchen/soup.png';
import spicyJollofImg from '../../../public/images/kitchen/spicy-smoky-jollof.png';
import stewImg from '../../../public/images/kitchen/stew-and-sauce.png';

import { KitchenActionButtons } from '@/components/features/kitchen-action-buttons';
import { KitchenMealGrid } from '@/components/features/kitchen-meal-grid';
import { KitchenStatsCarousel } from '@/components/features/kitchen-stats-carousel';
import { DeliveryIcon, DotIcon, LocationIcon, PickupIcon } from '@/components/icons';
import { StatusBadge } from '@/components/ui/badge';
import type { Kitchen } from '@/types';

// ---------------------------------------------------------------------------
// Mock data — replace with an API call when the backend is ready
// ---------------------------------------------------------------------------
function getKitchen(kitchenId: string): Kitchen {
  return {
    id: kitchenId,
    name: 'Sandra Kitchen',
    bannerImage: bannerImg,
    avatarImage: avatarImg,
    location: 'Ikate, Lekki',
    isOpen: false,
    pickup: { available: true },
    delivery: { available: true, price: 2000 },
    stats: { totalOrders: 186, rating: 4.8, reviewCount: 374 },
    categories: [
      { id: 'soups', name: 'Soups', image: soupImg },
      { id: 'rice-pasta', name: 'Rice & Pasta', image: friedRiceImg },
      { id: 'stew-sauce', name: 'Stew & Sauce', image: stewImg },
    ],
    meals: [
      {
        id: 'm1',
        name: 'Spicy smoky jollof',
        imageUrl: spicyJollofImg,
        price: 15000,
        unit: 'Litre',
        soldCount: 34,
        category: 'rice-pasta',
      },
      {
        id: 'm2',
        name: 'Meat Plater',
        imageUrl: meatPlaterImg,
        price: 25000,
        unit: 'Pack',
        soldCount: 187,
        popular: true,
        category: 'soups',
      },
      {
        id: 'm3',
        name: 'Egusi Soup',
        imageUrl: soupImg,
        price: 12000,
        unit: 'Litre',
        soldCount: 92,
        popular: true,
        category: 'soups',
      },
      {
        id: 'm4',
        name: 'Pepper Stew',
        imageUrl: stewImg,
        price: 8000,
        unit: 'Litre',
        soldCount: 0,
        category: 'stew-sauce',
      },
      {
        id: 'm5',
        name: 'Fried Rice Special',
        imageUrl: friedRiceImg,
        price: 18000,
        unit: 'Pack',
        soldCount: 55,
        category: 'rice-pasta',
      },
      {
        id: 'm6',
        name: 'Ofe Onugbu',
        imageUrl: soupImg,
        price: 14000,
        unit: 'Litre',
        soldCount: 21,
        popular: true,
        category: 'soups',
      },
    ],
  };
}

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function KitchenPage({ params }: { params: Promise<{ kitchenId: string }> }) {
  const { kitchenId } = await params;
  const kitchen = getKitchen(kitchenId);
  const { stats } = kitchen;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ------------------------------------------------------------------ */}
      {/* Banner hero — no back button, this IS the landing page              */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative h-49 w-full overflow-hidden bg-neutral-200 sm:h-64 lg:h-72">
        <Image
          src={kitchen.bannerImage}
          alt={`${kitchen.name} banner`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Design overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, #D9D9D9, #D9D9D9), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="mx-auto max-w-3xl px-4 pb-10 lg:max-w-5xl">
        {/* Profile header */}
        <div className="-mt-3 mb-4 flex items-end gap-4">
          <div className="relative h-18.5 w-18.5 shrink-0 overflow-hidden rounded-full border-4 border-white bg-neutral-200">
            <Image
              src={kitchen.avatarImage}
              alt={kitchen.name}
              fill
              className="object-cover"
              sizes="74px"
            />
          </div>
          <div className="pb-1">
            <h1 className="font-inter text-base leading-none font-semibold tracking-normal text-black">
              {kitchen.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="flex items-center gap-1 text-sm text-[#5C5C5C]">
                <LocationIcon className="h-3 w-[13.71182918548584px]" />
                {kitchen.location}
              </span>
              <StatusBadge isOpen={kitchen.isOpen} />
            </div>
          </div>
        </div>

        {/* Pickup / Delivery info */}
        <div className="text-[background: var(--Grey-600, #222222); ] mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5">
            <PickupIcon className="h-4 w-4" />
            Pick-up
          </span>
          <DotIcon />
          <span className={kitchen.pickup.available ? 'font-medium text-neutral-900' : ''}>
            {kitchen.pickup.available ? 'Available' : 'Unavailable'}
          </span>
          <DotIcon />
          <span className="flex items-center gap-1.5">
            <DeliveryIcon className="h-4 w-4" />
            Delivery
          </span>
          <DotIcon />
          <span className="font-medium text-neutral-900">{fmt(kitchen.delivery.price)}</span>
        </div>

        {/* Stats carousel */}
        <KitchenStatsCarousel
          totalOrders={stats.totalOrders}
          rating={stats.rating}
          reviewCount={stats.reviewCount}
        />

        {/* Action buttons */}
        <KitchenActionButtons kitchenId={kitchenId} />

        {/* Category filter + meal grid (client) */}
        <KitchenMealGrid
          categories={kitchen.categories}
          meals={kitchen.meals}
          isKitchenOpen={kitchen.isOpen}
        />
      </div>
    </div>
  );
}

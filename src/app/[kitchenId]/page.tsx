import Image from 'next/image';
import { notFound } from 'next/navigation';

import avatarImg from '../../../public/images/kitchen/avatar.png';
import bannerImg from '../../../public/images/kitchen/banner.jpg';
import soupImg from '../../../public/images/kitchen/soup.png';

import { KitchenActionButtons } from '@/components/features/kitchen-action-buttons';
import { KitchenMealGrid } from '@/components/features/kitchen-meal-grid';
import { KitchenStatsCarousel } from '@/components/features/kitchen-stats-carousel';
import { DeliveryIcon, DotIcon, LocationIcon, PickupIcon } from '@/components/icons';
import { StatusBadge } from '@/components/ui/badge';
import { getStore, unitLabel } from '@/lib/api';
import type { StoreResponse } from '@/lib/api';
import type { ImageSrc, Kitchen } from '@/types';

function safeImage(url: string | undefined, fallback: ImageSrc): ImageSrc {
  return url?.startsWith('https://res.cloudinary.com/') ? url : fallback;
}

function toKitchen(handle: string, { store, products }: StoreResponse): Kitchen {
  return {
    id: handle,
    name: store.storeName,
    bannerImage: safeImage(store.coverImage, bannerImg),
    avatarImage: safeImage(store.profileImage, avatarImg),
    location: store.kitchenAddress,
    isOpen: store.isAvailable,
    pickup: { available: Boolean(store.pickupWindow) },
    delivery: { available: store.deliveryEnabled, price: store.deliveryFee },
    stats: {
      totalOrders: store.ordersCount,
      rating: store.rating,
      reviewCount: store.reviewsCount,
    },
    // The store endpoint returns category ids only; the chip row stays hidden
    // until a categories endpoint provides names and images.
    categories: [],
    meals: products
      .filter((p) => p.isAvailable)
      .map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: safeImage(p.images[0]?.url, soupImg),
        price: Math.round(p.customerPrice),
        unit: unitLabel(p.unitType),
        soldCount: 0,
        category: p.category,
      })),
  };
}

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export default async function KitchenPage({ params }: { params: Promise<{ kitchenId: string }> }) {
  const { kitchenId } = await params;
  const data = await getStore(kitchenId);
  if (!data) notFound();

  const kitchen = toKitchen(kitchenId, data);
  const { stats } = kitchen;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative h-49 w-full overflow-hidden bg-neutral-200 sm:h-64 lg:h-72">
        <Image
          src={kitchen.bannerImage}
          alt={`${kitchen.name} banner`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, #D9D9D9, #D9D9D9), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-10 lg:max-w-5xl">
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

        <KitchenStatsCarousel
          totalOrders={stats.totalOrders}
          rating={stats.rating}
          reviewCount={stats.reviewCount}
        />

        <KitchenActionButtons kitchenId={kitchenId} />

        <KitchenMealGrid
          categories={kitchen.categories}
          meals={kitchen.meals}
          isKitchenOpen={kitchen.isOpen}
          kitchenId={kitchenId}
        />
      </div>
    </div>
  );
}

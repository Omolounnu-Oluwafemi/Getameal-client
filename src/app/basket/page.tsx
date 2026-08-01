
import { notFound } from 'next/navigation';

import { BasketClient } from '@/components/features/basket-client';
import { getStore, unitLabel } from '@/lib/api';
import type { ImageSrc, Extra } from '@/types';

function safeImage(url: string | undefined, fallback: ImageSrc): ImageSrc {
  return url?.startsWith('https://res.cloudinary.com/') ? url : fallback;
}

export default async function BasketPage({
  searchParams,
}: {
  searchParams: Promise<{ kitchen?: string }>;
}) {
  // The store handle rides in on ?kitchen= from the meal page's basket button.
  const { kitchen } = await searchParams;
  if (!kitchen) notFound();

  const kitchenId = kitchen;
  const data = await getStore(kitchenId);

  const profileImage = data?.store.profileImage;
  const productFallback = profileImage?.startsWith('https://res.cloudinary.com/')
    ? profileImage
    : '/icon.svg';

  const moreMeals =
    data?.products
      .filter((p) => p.isAvailable)
      .map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: safeImage(p.images[0]?.url, productFallback),
        price: Math.round(p.customerPrice),
        unit: unitLabel(p.unitType),
        soldCount: 0,
        isAvailable: p.isAvailable,
      })) ?? [];

  const pickupWindow = data
    ? `${data.store.pickupWindow.from} to ${data.store.pickupWindow.to}`
    : '';

  // Each product's extras catalog, keyed by product id — cart items only
  // carry the add-ons already attached, not what's available to add.
  const productExtras: Record<string, Extra[]> = Object.fromEntries(
    (data?.products ?? []).map((p) => [
      p.id,
      p.addOns.map((a) => ({ id: a._id, name: a.name, price: a.price })),
    ]),
  );

  return (
    <BasketClient
      moreMeals={moreMeals}
      preparationDays={data?.store.preparationDays ?? 1}
      pickupWindow={pickupWindow}
      kitchenId={kitchenId}
      deliveryFee={data?.store.deliveryFee ?? 0}
      fallbackImage={productFallback}
      productExtras={productExtras}
    />
  );
}

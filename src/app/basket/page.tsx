import soupImg from '../../../public/images/kitchen/soup.png';

import { BasketClient } from '@/components/features/basket-client';
import { getStore, unitLabel } from '@/lib/api';
import type { ImageSrc } from '@/types';

function safeImage(url: string | undefined, fallback: ImageSrc): ImageSrc {
  return url?.startsWith('https://res.cloudinary.com/') ? url : fallback;
}

export default async function BasketPage({
  searchParams,
}: {
  searchParams: Promise<{ kitchen?: string }>;
}) {
  // The store handle rides in on ?kitchen= from the meal page's basket
  // button; the fallback covers direct visits during development.
  const { kitchen } = await searchParams;
  const kitchenId = kitchen ?? 'dev-clinton';
  const data = await getStore(kitchenId);

  const moreMeals =
    data?.products
      .filter((p) => p.isAvailable)
      .map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: safeImage(p.images[0]?.url, soupImg),
        price: Math.round(p.customerPrice),
        unit: unitLabel(p.unitType),
        soldCount: 0,
        category: p.category,
      })) ?? [];

  const pickupWindow = data
    ? `${data.store.pickupWindow.from} to ${data.store.pickupWindow.to}`
    : '';

  return (
    <BasketClient
      moreMeals={moreMeals}
      preparationDays={data?.store.preparationDays ?? 1}
      pickupWindow={pickupWindow}
      kitchenId={kitchenId}
      deliveryFee={data?.store.deliveryFee ?? 0}
    />
  );
}

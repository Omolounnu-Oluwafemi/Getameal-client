import Image from 'next/image';
import { notFound } from 'next/navigation';

import bannerImg from '../../../../public/images/kitchen/banner.jpg';
import spicyJollofImg from '../../../../public/images/kitchen/spicy-smoky-jollof.png';

import { MealDescriptionCard } from '@/components/features/meal-description-card';
import { MealDetailClient } from '@/components/features/meal-detail-client';
import { MealFulfilmentCard } from '@/components/features/meal-fulfilment-card';
import { MealGalleryHeader } from '@/components/features/meal-gallery-header';
import { MealPriceCard } from '@/components/features/meal-price-card';
import { MealProductInsightCard } from '@/components/features/meal-product-insight-card';
import { getProduct, unitLabel } from '@/lib/api';
import type { ImageSrc, MealDetail } from '@/types';

function safeImage(url: string | undefined, fallback: ImageSrc): ImageSrc {
  return url?.startsWith('https://res.cloudinary.com/') ? url : fallback;
}

export default async function MealDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kitchen?: string; qty?: string }>;
}) {
  const { id } = await params;
  const { kitchen, qty } = await searchParams;
  const initialQty = Math.max(1, Number.parseInt(qty ?? '1', 10) || 1);
  const kitchenId = kitchen ?? 'dev-clinton';
  const result = await getProduct(kitchenId, id);
  if (!result) notFound();

  const { store, product } = result;

  const meal: MealDetail = {
    id: product.id,
    name: product.name,
    images: product.images.length
      ? product.images.map((img) => safeImage(img.url, spicyJollofImg))
      : [spicyJollofImg],
    price: Math.round(product.customerPrice),
    unit: unitLabel(product.unitType),
    description: product.whatsIncluded,
    extras: product.addOns.map((addOn) => ({
      id: addOn._id,
      name: addOn.name,
      price: addOn.price,
    })),
    totalOrders: 0,
    listedDate: '—',
    delivery: { available: store.deliveryEnabled, price: store.deliveryFee },
    pickup: { available: Boolean(store.pickupWindow) },
    kitchenId,
  };

  const kitchenBanner = safeImage(store.coverImage, bannerImg);

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Kitchen banner — the "peek" visible above the meal sheet */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={kitchenBanner}
          alt="Kitchen banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#130c0cbd]" />
      </div>

      {/* Meal sheet — slides over the banner */}
      <div className="relative -mt-16 rounded-t-[20px] bg-white">
        <MealGalleryHeader images={meal.images} alt={meal.name} kitchenId={meal.kitchenId} />

        <div className="mx-auto max-w-2xl space-y-2.5 px-4 pt-5 pb-34 lg:max-w-3xl">
          <MealPriceCard price={meal.price} unit={meal.unit} name={meal.name} />
          <MealDescriptionCard description={meal.description} />
          <MealDetailClient
            productId={meal.id}
            basePrice={meal.price}
            unit={meal.unit}
            extras={meal.extras}
            initialQty={initialQty}
            kitchenId={kitchenId}
          />
          <MealProductInsightCard totalOrders={meal.totalOrders} listedDate={meal.listedDate} />
          <MealFulfilmentCard delivery={meal.delivery} pickup={meal.pickup} />
        </div>
      </div>
    </div>
  );
}

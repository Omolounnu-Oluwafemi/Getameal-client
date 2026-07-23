import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import bannerImg from '../../../../public/images/kitchen/banner.jpg';

import { CloseIcon, ShareIcon } from '@/components/icons';
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
  // The kitchen handle rides in on ?kitchen= from the kitchen page.
  if (!kitchen) notFound();

  const kitchenId = kitchen;
  const result = await getProduct(kitchenId, id);
  if (!result) notFound();

  const { store, product } = result;

  // Products without a photo fall back to the cook's profile image, then the
  // app icon — never an unrelated dish photo.
  const productFallback = safeImage(store.profileImage, '/icon.svg');

  const meal: MealDetail = {
    id: product.id,
    name: product.name,
    images: product.images.length
      ? product.images.map((img) => safeImage(img.url, productFallback))
      : [productFallback],
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
    // `fixed inset-0` pulls the whole page out of document flow — it can
    // never make <body> scrollable. Inside it, the banner is a static
    // backdrop that never moves, and the sheet is pinned in place with its
    // OWN internal scroll: the image, price, description, extras, etc. all
    // scroll together as one unit, the image included — nothing pins or
    // stays behind while the rest moves.
    <div className="fixed inset-0 overflow-hidden bg-neutral-900">
      {/* Kitchen banner — static backdrop, never scrolls */}
      <div className="absolute inset-x-0 top-0 h-40 w-full overflow-hidden">
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

      {/* Close / share — fixed to the viewport, sitting over the gallery
          photo (the sheet starts at top-24; +16px lands on the image) and
          staying put there as the sheet's content scrolls underneath. */}
      <Link
        href={`/${kitchenId}`}
        className="fixed top-28 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2.5 shadow-[0px_4px_20px_0px_#00000040]"
        aria-label="Back to kitchen"
      >
        <CloseIcon />
      </Link>
      <button
        className="fixed top-28 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2.5 shadow-[0px_4px_20px_0px_#00000040]"
        aria-label="Share"
      >
        <ShareIcon />
      </button>

      {/* Meal sheet — fixed in place; only its content scrolls */}
      <div className="absolute inset-x-0 top-24 bottom-0 overflow-y-auto rounded-t-[20px] bg-white">
        <MealGalleryHeader images={meal.images} alt={meal.name} />

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

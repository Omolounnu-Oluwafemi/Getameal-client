import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import avatarImg from '../../../public/images/kitchen/avatar.png';
import bannerImg from '../../../public/images/kitchen/banner.jpg';

import { FloatingBasketButton } from '@/components/features/floating-basket-button';
import { KitchenPageClient } from '@/components/features/kitchen-page-client';
import { getStore, unitLabel } from '@/lib/api';
import type { StoreResponse } from '@/lib/api';
import type { ImageSrc, Kitchen } from '@/types';

function safeImage(url: string | undefined, fallback: ImageSrc): ImageSrc {
  return url?.startsWith('https://res.cloudinary.com/') ? url : fallback;
}

function toKitchen(handle: string, { store, products }: StoreResponse): Kitchen {
  // Products without a photo fall back to the cook's profile image, then the
  // app icon — never an unrelated dish photo.
  const productFallback = safeImage(store.profileImage, '/icon.svg');

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
    meals: products.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: safeImage(p.images[0]?.url, productFallback),
      price: Math.round(p.customerPrice),
      unit: unitLabel(p.unitType),
      // Not returned by the store API yet — always 0 until the backend adds
      // a real per-product sold count.
      soldCount: 0,
      isAvailable: p.isAvailable,
    })),
  };
}

// WhatsApp/social previews for a kitchen link should show its own cover
// photo and name, not the generic GetaMeal card — same idea as /pay and
// /order's metadata.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ kitchenId: string }>;
}): Promise<Metadata> {
  const { kitchenId } = await params;
  const data = await getStore(kitchenId);
  if (!data) return {};

  const { store } = data;
  const title = store.storeName;
  const description = store.storeDescription || `Order from ${store.storeName} on GetaMeal.`;
  const image = store.coverImage?.startsWith('https://res.cloudinary.com/')
    ? store.coverImage
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function KitchenPage({ params }: { params: Promise<{ kitchenId: string }> }) {
  const { kitchenId } = await params;
  const data = await getStore(kitchenId);
  if (!data) notFound();

  const kitchen = toKitchen(kitchenId, data);

  return (
    <>
      <KitchenPageClient kitchen={kitchen} kitchenId={kitchenId} />
      <FloatingBasketButton kitchenId={kitchenId} />
    </>
  );
}

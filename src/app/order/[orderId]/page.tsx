import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CustomOrderPaymentClient } from '@/components/features/custom-order-payment-client';
import { getOrder, getStore } from '@/lib/api';
import { imageUrl } from '@/lib/orders';

interface PageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ phone?: string }>;
}

// The cook shares this link once a custom order is priced — the customer's
// phone rides along as a query param, same convention as /receipt/[orderId].

/**
 * WhatsApp/social previews should show the cook's own branding, not a
 * generic "GetaMeal" card — same idea as /pay/[orderId]'s metadata.
 */
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  const { phone } = await searchParams;
  if (!phone) return {};

  const order = await getOrder(orderId, phone);
  if (!order) return {};

  const title = `Your order from ${order.cook.storeName}`;
  const description = order.customOrderTitle || 'Review and pay for your order on GetaMeal.';

  const store = await getStore(order.cook.storeHandle);
  const image = store?.store.coverImage || imageUrl(order.cook.profileImage);

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

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { orderId } = await params;
  const { phone } = await searchParams;

  if (!phone) notFound();

  const order = await getOrder(orderId, phone);
  if (!order) notFound();

  return <CustomOrderPaymentClient order={order} />;
}

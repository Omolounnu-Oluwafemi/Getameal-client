import { notFound } from 'next/navigation';

import { LeaveReviewClient } from '@/components/features/leave-review-client';
import { getStore } from '@/lib/api';

/**
 * Opened from the WhatsApp review-request message sent 24h after an order.
 * The link carries the order context as query params, e.g.:
 *   /review/<orderId>?seller=dev-clinton&name=Kingsley&phone=08068477110
 */
export default async function LeaveReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ seller?: string; name?: string; phone?: string }>;
}) {
  const { orderId } = await params;
  const { seller, name, phone } = await searchParams;

  const data = await getStore(seller ?? 'dev-clinton');
  if (!data) notFound();

  return (
    <LeaveReviewClient
      orderId={orderId}
      sellerId={data.store.storeHandle}
      cookId={data.store.cookId}
      sellerName={data.store.storeName}
      sellerLocation={data.store.kitchenAddress}
      ordersCompleted={data.store.ordersCount}
      customerName={name ?? 'Anonymous'}
      whatsappNumber={phone ?? ''}
    />
  );
}

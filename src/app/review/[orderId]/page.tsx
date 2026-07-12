import { LeaveReviewClient } from '@/components/features/leave-review-client';

// ---------------------------------------------------------------------------
// Opened from the WhatsApp review-request message sent 24h after an order.
// The link carries the order context as query params, e.g.:
//   /review/GM2048?seller=amakas-kitchen&name=Kingsley&phone=2348068477110
// Seller details are mocked until the backend can resolve them from sellerId.
// ---------------------------------------------------------------------------
export default async function LeaveReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ seller?: string; name?: string; phone?: string }>;
}) {
  const { orderId } = await params;
  const { seller, name, phone } = await searchParams;

  return (
    <LeaveReviewClient
      orderId={orderId}
      sellerId={seller ?? 'amakas-kitchen'}
      sellerName="Amaka's Kitchen"
      sellerLocation="Ikate, Lekki"
      ordersCompleted={20}
      customerName={name ?? 'Kingsley'}
      whatsappNumber={phone ?? ''}
    />
  );
}

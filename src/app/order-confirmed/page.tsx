import avatarImg from '../../../public/images/kitchen/avatar.png';

import { OrderConfirmedClient } from '@/components/features/order-confirmed-client';
import { verifyPayment } from '@/lib/api';

/**
 * Landing page after payment (Paystack redirects here with
 * ?trxref=...&reference=..., verified before showing success) and after a
 * custom order request (?orderId=... straight from creation, no payment yet).
 * The client looks the order up for real details; the props below are
 * fallbacks for dev navigation.
 */
export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{
    method?: string;
    reference?: string;
    trxref?: string;
    orderId?: string;
  }>;
}) {
  const { method, reference, trxref, orderId } = await searchParams;
  const deliveryMethod = method === 'delivery' ? 'delivery' : 'pickup';

  // null = no reference in the URL (dev navigation) — skip verification.
  const order = reference ? await verifyPayment(reference, trxref) : null;
  const paymentConfirmed = reference ? Boolean(order) : null;
  const effectiveOrderId = order?.id ?? orderId;

  return (
    <OrderConfirmedClient
      paymentConfirmed={paymentConfirmed}
      orderId={effectiveOrderId}
      orderNumber={
        effectiveOrderId ? `#${effectiveOrderId.slice(-6).toUpperCase()}` : '#GM2048'
      }
      sellerId="dev-clinton"
      sellerName="Amaka's Kitchen"
      sellerWhatsApp="2348000000000"
      chatMessage="Hi Amaka's Kitchen, I just placed order #GM2048 on GetaMeal."
      deliveryMethod={deliveryMethod}
      pickupAddress="Shop 209, Ikota shopping center, VGC"
      pickupImage={avatarImg}
      readyTime="Usually ready in 1 day"
      amountPaid={order?.totalAmount ?? 20700}
    />
  );
}

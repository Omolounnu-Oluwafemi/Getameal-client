import { notFound } from 'next/navigation';

import { CustomOrderPaymentClient } from '@/components/features/custom-order-payment-client';
import { getOrder } from '@/lib/api';

// The cook shares this link once a custom order is priced — the customer's
// phone rides along as a query param, same convention as /receipt/[orderId].
export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { orderId } = await params;
  const { phone } = await searchParams;

  if (!phone) notFound();

  const order = await getOrder(orderId, phone);
  if (!order) notFound();

  return <CustomOrderPaymentClient order={order} />;
}

import { notFound } from 'next/navigation';

import { ConfirmPayClient } from '@/components/features/confirm-pay-client';
import { getStore } from '@/lib/api';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string; kitchen?: string }>;
}) {
  // The store handle rides in on ?kitchen= from the checkout sheet; the
  // fallback covers direct visits during development.
  const { method, kitchen } = await searchParams;
  const deliveryMethod = method === 'delivery' ? 'delivery' : 'pickup';
  const kitchenId = kitchen ?? 'dev-clinton';

  const data = await getStore(kitchenId);
  if (!data) notFound();
  const { store } = data;

  return (
    <ConfirmPayClient
      deliveryMethod={deliveryMethod}
      deliveryFee={store.deliveryFee}
      kitchenId={kitchenId}
      preparationDays={store.preparationDays}
      readyTime={store.pickupWindow.from}
      kitchen={{
        name: store.storeName,
        location: store.kitchenAddress,
        ordersCompleted: store.ordersCount,
      }}
    />
  );
}

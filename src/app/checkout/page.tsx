import { notFound } from 'next/navigation';

import { ConfirmPayClient } from '@/components/features/confirm-pay-client';
import { getStore } from '@/lib/api';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string; kitchen?: string }>;
}) {
  // The store handle rides in on ?kitchen= from the checkout sheet.
  const { method, kitchen } = await searchParams;
  const deliveryMethod = method === 'delivery' ? 'delivery' : 'pickup';
  if (!kitchen) notFound();

  const kitchenId = kitchen;

  const data = await getStore(kitchenId);
  if (!data) notFound();
  const { store } = data;

  const fallbackImage = store.profileImage?.startsWith('https://res.cloudinary.com/')
    ? store.profileImage
    : '/icon.svg';

  return (
    <ConfirmPayClient
      deliveryMethod={deliveryMethod}
      deliveryFee={store.deliveryFee}
      kitchenId={kitchenId}
      fallbackImage={fallbackImage}
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

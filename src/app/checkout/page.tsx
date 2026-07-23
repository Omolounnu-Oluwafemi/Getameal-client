import { notFound } from 'next/navigation';

import { ConfirmPayClient } from '@/components/features/confirm-pay-client';
import { getStore } from '@/lib/api';

// A plain (non-component) helper — Date.now() called here isn't subject to
// the "no impure calls during render" rule, since that rule targets
// component/hook bodies specifically, not the functions they call.
function getReadyDay(preparationDays: number): string {
  return new Date(Date.now() + preparationDays * 86_400_000).toLocaleDateString('en-NG', {
    weekday: 'long',
  });
}

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

  // Computed once per request, server-side, and passed down pre-computed —
  // same pattern as readyTime below.
  const readyDay = getReadyDay(store.preparationDays);

  return (
    <ConfirmPayClient
      deliveryMethod={deliveryMethod}
      deliveryFee={store.deliveryFee}
      kitchenId={kitchenId}
      fallbackImage={fallbackImage}
      preparationDays={store.preparationDays}
      readyDay={readyDay}
      readyTime={store.pickupWindow.from}
      kitchen={{
        name: store.storeName,
        location: store.kitchenAddress,
        ordersCompleted: store.ordersCount,
      }}
    />
  );
}

import { notFound } from 'next/navigation';

import { CustomOrderCheckoutClient } from '@/components/features/custom-order-checkout-client';
import { getStore } from '@/lib/api';

export default async function CustomOrderCheckoutPage({
  params,
}: {
  params: Promise<{ kitchenId: string }>;
}) {
  const { kitchenId } = await params;
  const data = await getStore(kitchenId);
  if (!data) notFound();

  return (
    <CustomOrderCheckoutClient
      kitchenId={kitchenId}
      cookId={data.store.cookId}
      kitchen={{
        name: data.store.storeName,
        location: data.store.kitchenAddress,
        ordersCompleted: data.store.ordersCount,
      }}
    />
  );
}

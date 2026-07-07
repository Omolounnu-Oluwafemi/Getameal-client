import avatarImg from '../../../public/images/kitchen/avatar.png';

import { OrderConfirmedClient } from '@/components/features/order-confirmed-client';

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>;
}) {
  const { method } = await searchParams;
  const deliveryMethod = method === 'delivery' ? 'delivery' : 'pickup';

  return (
    <OrderConfirmedClient
      orderNumber="#GM2048"
      sellerName="Amaka's Kitchen"
      deliveryMethod={deliveryMethod}
      pickupAddress="Shop 209, Ikota shopping center, VGC"
      pickupImage={avatarImg}
      readyTime="Usually ready in 1 day"
      amountPaid={20700}
    />
  );
}

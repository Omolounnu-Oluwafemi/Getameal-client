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
      sellerId="dev-clinton"
      sellerName="Amaka's Kitchen"
      sellerWhatsApp="2348000000000"
      chatMessage="Hi Amaka's Kitchen, I just placed order #GM2048 on GetaMeal."
      deliveryMethod={deliveryMethod}
      pickupAddress="Shop 209, Ikota shopping center, VGC"
      pickupImage={avatarImg}
      readyTime="Usually ready in 1 day"
      amountPaid={20700}
    />
  );
}

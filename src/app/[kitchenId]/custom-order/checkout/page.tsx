import avatarImg from '../../../../../public/images/kitchen/avatar.png';

import { CustomOrderCheckoutClient } from '@/components/features/custom-order-checkout-client';

// ---------------------------------------------------------------------------
// Mock — mirrors the custom order request data.
// Replace with an API call when the backend is ready.
// ---------------------------------------------------------------------------
export default async function CustomOrderCheckoutPage({
  params,
}: {
  params: Promise<{ kitchenId: string }>;
}) {
  const { kitchenId } = await params;
  void kitchenId;

  return (
    <CustomOrderCheckoutClient
      kitchen={{
        name: "Aunty Kemi's Kitchen",
        location: 'Ikate, Lekki',
        ordersCompleted: 20,
        avatar: avatarImg,
      }}
      orderSummary="5 litres Egusi Soup"
      customerName="Kingsley Orji"
      whatsappNumber="+2348068477110"
      readyBy="Saturday, 3:00 PM"
      deliveryMethod="delivery"
      itemsTotal={18700}
      deliveryFee={1000}
    />
  );
}

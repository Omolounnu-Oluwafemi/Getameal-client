import jollofImg from '../../../../public/images/kitchen/spicy-smoky-jollof.png';
import friedRiceImg from '../../../../public/images/kitchen/fried-rice-special.png';
import stewImg from '../../../../public/images/kitchen/stew-and-sauce.png';

import { ReceiptClient } from '@/components/features/receipt-client';

// ---------------------------------------------------------------------------
// Mock — replace with an API call (fetch order by id) when the backend is
// ready. Demo states: ?method=pickup|delivery and ?status=cancelled
// ---------------------------------------------------------------------------
export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ method?: string; status?: string }>;
}) {
  const { orderId } = await params;
  void orderId;
  const { method, status } = await searchParams;
  const deliveryMethod = method === 'pickup' ? 'pickup' : 'delivery';

  return (
    <ReceiptClient
      status={status === 'cancelled' ? 'cancelled' : 'completed'}
      deliveryMethod={deliveryMethod}
      customerName="Kingsley"
      date="17 Jan 2026"
      total={20000}
      deliveryAddress="123 Admiralty way Lekki, Lagos State, Nigeria"
      pickupLocation="Ajah"
      pickupAddress="Shop 209, Ikota shopping center, VGC"
      items={[
        {
          id: 'i1',
          name: 'Jollof Rice + Chicken',
          qty: 2,
          unit: 'Litres',
          price: 5300,
          image: jollofImg,
          addOns: [{ name: 'Plantain add-on', qty: 2, price: 5300 }],
        },
        {
          id: 'i2',
          name: 'Jollof Rice + Chicken',
          qty: 2,
          unit: 'Packs',
          price: 5300,
          image: friedRiceImg,
        },
        {
          id: 'i3',
          name: 'Jollof Rice + Chicken',
          qty: 2,
          unit: 'Plates',
          price: 5300,
          image: stewImg,
        },
      ]}
      orderNumber="#GM2048"
      sellerName="Amaka's Kitchen"
      readyTime="Usually ready in 1 day"
      amountPaid={20700}
    />
  );
}

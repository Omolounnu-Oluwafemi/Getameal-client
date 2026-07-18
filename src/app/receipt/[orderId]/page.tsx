import { notFound } from 'next/navigation';

import jollofImg from '../../../../public/images/kitchen/spicy-smoky-jollof.png';
import friedRiceImg from '../../../../public/images/kitchen/fried-rice-special.png';
import stewImg from '../../../../public/images/kitchen/stew-and-sauce.png';

import { ReceiptClient } from '@/components/features/receipt-client';
import { getOrder } from '@/lib/api';
import type { OrderDetails } from '@/lib/orders';

/** Collapse repeated add-on entries (one per unit) into name + count rows. */
function groupAddOns(addOns: { name: string; price: number }[]) {
  const groups = new Map<string, { name: string; price: number; qty: number }>();
  for (const addOn of addOns) {
    const existing = groups.get(addOn.name);
    if (existing) {
      existing.qty += 1;
    } else {
      groups.set(addOn.name, { name: addOn.name, price: addOn.price, qty: 1 });
    }
  }
  return [...groups.values()];
}

function toReceiptItems(order: OrderDetails) {
  return order.items.map((item) => {
    const product = typeof item.productId === 'object' ? item.productId : null;
    const imageUrl = product?.images?.[0]?.url;
    return {
      id: item._id,
      name: item.name,
      qty: item.quantity,
      unit: '',
      price: Math.round(item.price),
      image: imageUrl?.startsWith('https://res.cloudinary.com/') ? imageUrl : jollofImg,
      addOns: groupAddOns(item.addOns),
    };
  });
}

// The WhatsApp receipt link carries the customer's phone as a query param;
// without it (dev preview) the mock receipt renders instead.
// Demo states: ?method=pickup|delivery and ?status=cancelled
export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ method?: string; status?: string; phone?: string }>;
}) {
  const { orderId } = await params;
  const { method, status, phone } = await searchParams;
  const deliveryMethod = method === 'pickup' ? 'pickup' : 'delivery';

  if (phone) {
    const order = await getOrder(orderId, phone);
    if (!order) notFound();

    return (
      <ReceiptClient
        status={order.status === 'cancelled' ? 'cancelled' : 'completed'}
        deliveryMethod={order.deliveryType}
        customerName=""
        date={new Date(order.createdAt).toLocaleDateString('en-NG', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
        total={Math.round(order.totalAmount)}
        deliveryAddress="You’ll get delivery updates on WhatsApp."
        pickupLocation={order.cook.pickupLandmark}
        pickupAddress={order.cook.kitchenAddress}
        items={toReceiptItems(order)}
        orderNumber={`#${order.id.slice(-6).toUpperCase()}`}
        sellerName={order.cook.storeName}
        readyTime={`${new Date(order.readyDate).toLocaleDateString('en-NG', { weekday: 'long' })}, ${order.readyTime}`}
        amountPaid={Math.round(order.totalAmount)}
      />
    );
  }

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

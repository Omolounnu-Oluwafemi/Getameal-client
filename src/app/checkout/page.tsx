import avatarImg from '../../../public/images/kitchen/avatar.png';
import soupImg from '../../../public/images/kitchen/soup.png';
import spicyJollofImg from '../../../public/images/kitchen/spicy-smoky-jollof.png';
import stewImg from '../../../public/images/kitchen/stew-and-sauce.png';

import { ConfirmPayClient } from '@/components/features/confirm-pay-client';

const KITCHEN = {
  name: "Amaka's Kitchen",
  location: 'Ikate, Lekki',
  ordersCompleted: 20,
  avatar: avatarImg,
};

const ORDER_ITEMS = [
  {
    id: '1',
    name: 'Jollof Rice + Chicken',
    qty: 2,
    unit: 'Litres',
    price: 5300,
    image: soupImg,
    addOns: [{ name: 'Plantain add-on', qty: 2, price: 5300 }],
  },
  {
    id: '2',
    name: 'Jollof Rice + Chicken',
    qty: 2,
    unit: 'Packs',
    price: 5300,
    image: spicyJollofImg,
  },
  {
    id: '3',
    name: 'Jollof Rice + Chicken',
    qty: 2,
    unit: 'Plates',
    price: 5300,
    image: stewImg,
  },
];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>;
}) {
  const { method } = await searchParams;
  const deliveryMethod = method === 'delivery' ? 'delivery' : 'pickup';

  return (
    <ConfirmPayClient
      deliveryMethod={deliveryMethod}
      deliveryFee={2300}
      kitchen={KITCHEN}
      items={ORDER_ITEMS}
    />
  );
}

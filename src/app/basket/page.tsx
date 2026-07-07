import soupImg from '../../../public/images/kitchen/soup.png';
import spicyJollofImg from '../../../public/images/kitchen/spicy-smoky-jollof.png';
import stewImg from '../../../public/images/kitchen/stew-and-sauce.png';
import friedRiceImg from '../../../public/images/kitchen/fried-rice-special.png';
import meatPlaterImg from '../../../public/images/kitchen/meat-plater.png';

import { BasketClient } from '@/components/features/basket-client';

const MOCK_ITEMS = [
  { id: '1', name: 'Vegetable Soup', sold: 23, price: 5000, unit: 'Litre', qty: 2, image: soupImg },
  { id: '2', name: 'A plate of Hot Jollof Rice', sold: 23, price: 5000, unit: 'Pack', qty: 1, image: spicyJollofImg },
  { id: '3', name: 'Egusi Soup with Swallow', sold: 23, price: 5000, unit: 'Portion', qty: 2, image: stewImg },
];

const MORE_MEALS = [
  { id: 'm1', name: 'Fried Rice Special', image: friedRiceImg, price: 5000, badge: 'Popular' },
  { id: 'm2', name: 'Meat Platter', image: meatPlaterImg, price: 6500, badge: 'Popular' },
];

export default function BasketPage() {
  return (
    <BasketClient
      initialItems={MOCK_ITEMS}
      moreMeals={MORE_MEALS}
      pickupDay="Saturday"
      pickupWindow="2:00 PM to 6:00 PM"
    />
  );
}

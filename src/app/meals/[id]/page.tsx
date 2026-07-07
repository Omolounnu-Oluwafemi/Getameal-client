import Image from 'next/image';

import bannerImg from '../../../../public/images/kitchen/banner.jpg';
import friedRiceImg from '../../../../public/images/kitchen/fried-rice-special.png';
import meatPlaterImg from '../../../../public/images/kitchen/meat-plater.png';
import soupImg from '../../../../public/images/kitchen/soup.png';
import spicyJollofImg from '../../../../public/images/kitchen/spicy-smoky-jollof.png';
import stewImg from '../../../../public/images/kitchen/stew-and-sauce.png';

import { MealDescriptionCard } from '@/components/features/meal-description-card';
import { MealDetailClient } from '@/components/features/meal-detail-client';
import { MealFulfilmentCard } from '@/components/features/meal-fulfilment-card';
import { MealGalleryHeader } from '@/components/features/meal-gallery-header';
import { MealPriceCard } from '@/components/features/meal-price-card';
import { MealProductInsightCard } from '@/components/features/meal-product-insight-card';
import type { ImageSrc, MealDetail } from '@/types';

// ---------------------------------------------------------------------------
// Mock data — replace with an API call when the backend is ready
// ---------------------------------------------------------------------------
const MEAL_IMAGES: Record<string, ImageSrc[]> = {
  m1: [spicyJollofImg, meatPlaterImg, soupImg, stewImg, friedRiceImg],
  m2: [meatPlaterImg, spicyJollofImg, stewImg],
  m3: [soupImg, friedRiceImg, spicyJollofImg],
  m4: [stewImg, soupImg, meatPlaterImg],
  m5: [friedRiceImg, spicyJollofImg, meatPlaterImg],
  m6: [soupImg, stewImg, friedRiceImg, spicyJollofImg],
};

function getMealDetail(id: string): MealDetail {
  return {
    id,
    name: 'A plate of Jollof Hot Jollof rice',
    images: MEAL_IMAGES[id] ?? [spicyJollofImg],
    price: 5000,
    unit: 'Litre',
    description:
      'Stir-Fried Jollof rice with vegetables and tamarind sauce, tofu, chives, beansprout and wrapped in egg crepe. Served with lime and roasted peanuts on the side.',
    extras: [
      { id: 'e1', name: 'Extra Chicken', price: 5000 },
      { id: 'e2', name: 'Extra Beef', price: 5000 },
      { id: 'e3', name: 'Extra Fish (Cat Fish)', price: 5000 },
      { id: 'e4', name: 'Extra Shrimps', price: 5000 },
    ],
    totalOrders: 286,
    listedDate: '20th June, 2026',
    delivery: { available: true, price: 2000 },
    pickup: { available: true },
    kitchenId: 'sandra-kitchen',
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function MealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meal = getMealDetail(id);

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Kitchen banner — the "peek" visible above the meal sheet */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={bannerImg}
          alt="Kitchen banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#130c0cbd]" />
      </div>

      {/* Meal sheet — slides over the banner */}
      <div className="relative -mt-16 rounded-t-[20px] bg-white">
        <MealGalleryHeader images={meal.images} alt={meal.name} kitchenId={meal.kitchenId} />

        <div className="mx-auto max-w-2xl space-y-2.5 px-4 pt-5 pb-40 lg:max-w-3xl">
          <MealPriceCard price={meal.price} unit={meal.unit} name={meal.name} />
          <MealDescriptionCard description={meal.description} />
          <MealDetailClient basePrice={meal.price} unit={meal.unit} extras={meal.extras} />
          <MealProductInsightCard totalOrders={meal.totalOrders} listedDate={meal.listedDate} />
          <MealFulfilmentCard delivery={meal.delivery} pickup={meal.pickup} />
        </div>
      </div>
    </div>
  );
}

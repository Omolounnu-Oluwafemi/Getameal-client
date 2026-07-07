import { DeliveryIcon, PickupIcon } from '@/components/icons';

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

interface MealFulfilmentCardProps {
  delivery: { available: boolean; price: number };
  pickup: { available: boolean };
}

export function MealFulfilmentCard({ delivery, pickup }: MealFulfilmentCardProps) {
  return (
    <section className="rounded-[20px] border-[0.73px] border-[#EDEDED] bg-white p-5 shadow-[0px_4px_20px_0px_#0000000D]">
      <h2 className="mb-4 font-semibold text-neutral-900">Fulfilment option</h2>
      <div className="space-y-6">
        <div className="font-inter flex items-center gap-4 text-sm leading-none font-medium text-black">
          <DeliveryIcon className="h-5.5 w-5.5" />
          Delivery
          <span className="ml-auto text-base font-semibold text-black">{fmt(delivery.price)}</span>
        </div>
        <div className="font-inter flex items-center gap-4 text-sm leading-none font-medium text-black">
          <PickupIcon className="h-5.5 w-5.5" />
          Pickup
          <span className="ml-auto text-base font-semibold text-neutral-900">
            {pickup.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </section>
  );
}

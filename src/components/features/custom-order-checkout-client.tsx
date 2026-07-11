'use client';

import { useRouter } from 'next/navigation';
import type { StaticImageData } from 'next/image';

import { Button } from '@/components/ui/button';
import { OrderConfirmIcon } from '../icons';

interface Kitchen {
  name: string;
  location: string;
  ordersCompleted: number;
  avatar: StaticImageData;
}

interface CustomOrderCheckoutClientProps {
  kitchen: Kitchen;
  orderSummary: string;
  customerName: string;
  whatsappNumber: string;
  readyBy: string;
  deliveryMethod: 'pickup' | 'delivery';
  itemsTotal: number;
  deliveryFee: number;
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export function CustomOrderCheckoutClient({
  kitchen,
  orderSummary,
  customerName,
  whatsappNumber,
  readyBy,
  deliveryMethod,
  itemsTotal,
  deliveryFee,
}: CustomOrderCheckoutClientProps) {
  const router = useRouter();
  const shippingCost = deliveryMethod === 'delivery' ? deliveryFee : 0;
  const totalToPay = itemsTotal + shippingCost;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Kitchen info */}
      <div className="flex items-center gap-2 px-5 py-6">
        <OrderConfirmIcon className="shrink-0" />
        <div>
          <p className="text-base font-bold text-black">{kitchen.name}</p>
          <p className="text-sm text-neutral-500">
            {kitchen.location} · {kitchen.ordersCompleted} orders completed
          </p>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {/* Your order */}
        <div className="rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]">
          <h2 className="p-4 text-base font-semibold text-black">Your order</h2>
          <div className="h-px bg-[#EDEDED]" />
          <p className="p-4 text-sm font-semibold text-black">{orderSummary}</p>
        </div>

        {/* Customer details */}
        <div className="rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]">
          <h2 className="p-4 text-base font-semibold text-black">Customer details</h2>
          <div className="h-px bg-[#EDEDED]" />
          <div className="space-y-5 p-4">
            <div>
              <p className="text-sm text-[#5C5C5C]">Full name</p>
              <p className="mt-0.5 text-base font-medium text-black">{customerName}</p>
            </div>
            <div>
              <p className="text-sm text-[#5C5C5C]">WhatsApp number</p>
              <p className="mt-0.5 text-base font-medium text-black">{whatsappNumber}</p>
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className="rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]">
          <h2 className="p-4 text-base font-semibold text-black">Order details</h2>
          <div className="h-px bg-[#EDEDED]" />
          <div className="space-y-5 p-4">
            <div>
              <p className="text-sm text-[#5C5C5C]">Ready by</p>
              <p className="mt-0.5 text-base font-medium text-black">{readyBy}</p>
            </div>
            <div>
              <p className="text-sm text-[#5C5C5C]">How you&apos;ll receive it</p>
              <p className="mt-0.5 text-base font-medium text-black">
                {deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price details */}
      <div className="mt-6 px-5">
        <h2 className="text-base font-semibold text-black">Price details</h2>
        <div className="mt-1">
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm font-medium text-[#222222]">Items total</span>
            <span className="text-sm font-bold text-black">{fmt(itemsTotal)}</span>
          </div>
          <div className="h-px bg-[#EDEDED]" />
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm font-medium text-[#222222]">
              {deliveryMethod === 'delivery' ? 'Delivery fee' : 'Pickup'}
            </span>
            <span className="text-sm font-bold text-black">
              {shippingCost === 0 ? 'Free' : fmt(shippingCost)}
            </span>
          </div>
          <div className="h-px bg-[#EDEDED]" />
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm text-[#222222]">Total to pay</span>
            <span className="text-sm font-bold text-black">{fmt(totalToPay)}</span>
          </div>
        </div>
      </div>

      <p className="px-5 pt-4 text-xs leading-relaxed text-[#5C5C5C]">
        Review your order details and pay to confirm.
      </p>

      {/* Fixed pay button */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          variant="brand"
          onClick={() => router.push(`/order-confirmed?method=${deliveryMethod}`)}
          className="h-13 w-full rounded-full text-sm font-semibold"
        >
          Pay — {fmt(totalToPay)}
        </Button>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { StaticImageData } from 'next/image';

import { Button } from '@/components/ui/button';

interface AddOn {
  name: string;
  qty: number;
  price: number;
}

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  image: StaticImageData;
  addOns?: AddOn[];
}

interface Kitchen {
  name: string;
  location: string;
  ordersCompleted: number;
  avatar: StaticImageData;
}

interface ConfirmPayClientProps {
  deliveryMethod: 'pickup' | 'delivery';
  deliveryFee: number;
  kitchen: Kitchen;
  items: OrderItem[];
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export function ConfirmPayClient({ deliveryMethod, deliveryFee, kitchen, items }: ConfirmPayClientProps) {
  const router = useRouter();
  const itemsTotal = items.reduce((sum, item) => {
    const addOnTotal = item.addOns?.reduce((s, a) => s + a.price * a.qty, 0) ?? 0;
    return sum + item.price * item.qty + addOnTotal;
  }, 0);
  const shippingCost = deliveryMethod === 'delivery' ? deliveryFee : 0;
  const totalToPay = itemsTotal + shippingCost;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="relative flex items-center justify-center px-5 pt-14 pb-5">
        <Link
          href="/basket"
          className="absolute left-5 flex h-9 w-9 items-center justify-center"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 16l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-black">Confirm and pay</h1>
      </div>

      {/* Kitchen info */}
      <div className="flex items-center gap-4 px-5 pb-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
          <Image src={kitchen.avatar} alt={kitchen.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-base font-bold text-black">{kitchen.name}</p>
          <p className="text-sm text-neutral-500">{kitchen.location} · {kitchen.ordersCompleted} orders completed</p>
        </div>
      </div>

      <div className="h-px bg-[#EDEDED]" />

      {/* How you'll get your order */}
      <div className="px-5 py-5">
        <h2 className="mb-4 text-base font-bold text-black">How you'll get your order</h2>

        <div className="flex items-start justify-between rounded-2xl border border-[#EDEDED] p-4">
          <div>
            {deliveryMethod === 'delivery' ? (
              <>
                <p className="text-sm font-bold text-black">Delivery Tomorrow</p>
                <p className="mt-1 text-sm text-neutral-500">
                  You'll get delivery updates on WhatsApp when your order is ready.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-black">Pickup — Free</p>
                <p className="mt-1 text-sm text-neutral-500">{kitchen.location}</p>
              </>
            )}
          </div>
          <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12l4-4-4-4" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {deliveryMethod === 'pickup' && (
          <p className="mt-3 text-xs text-neutral-500">Full pickup details will be shared after payment.</p>
        )}
      </div>

      <div className="h-px bg-[#EDEDED]" />

      {/* Your order */}
      <div className="px-5 py-5">
        <h2 className="mb-4 text-base font-bold text-black">Your order</h2>

        <div className="divide-y divide-[#EDEDED] rounded-2xl border border-[#EDEDED]">
          {items.map((item) => (
            <div key={item.id}>
              {/* Main item row */}
              <div className="flex items-center gap-3 p-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{item.name}</p>
                  <p className="text-sm text-neutral-500">
                    Qty {item.qty} {item.unit} · {fmt(item.price)} each
                  </p>
                </div>
              </div>

              {/* Add-ons */}
              {item.addOns?.map((addon, i) => (
                <div key={i} className="mx-4 mb-4 rounded-xl border border-[#EDEDED] px-4 py-3">
                  <p className="text-sm font-semibold text-black">{addon.name}</p>
                  <p className="text-sm text-neutral-500">
                    Qty {addon.qty} · {fmt(addon.price)} each
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#EDEDED]" />

      {/* Price details */}
      <div className="px-5 py-5">
        <h2 className="mb-4 text-base font-bold text-black">Price details</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Items total</span>
            <span className="text-sm font-semibold text-black">{fmt(itemsTotal)}</span>
          </div>
          <div className="h-px bg-[#EDEDED]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">{deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}</span>
            <span className="text-sm font-bold text-black">{shippingCost === 0 ? 'Free' : fmt(shippingCost)}</span>
          </div>
          <div className="h-px bg-[#EDEDED]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Total to pay</span>
            <span className="text-sm font-bold text-black">{fmt(totalToPay)}</span>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-neutral-500">
          By paying, you confirm this order and allow the seller to start preparing it.
        </p>
      </div>

      {/* Fixed pay button */}
      <div className="fixed inset-x-0 bottom-[-20] z-30 bg-white px-5 pb-10 pt-4 shadow-[0px_-4px_20px_0px_#0000001A]">
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

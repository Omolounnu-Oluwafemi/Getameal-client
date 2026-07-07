'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';

import { Button } from '@/components/ui/button';

interface OrderConfirmedClientProps {
  orderNumber: string;
  sellerName: string;
  deliveryMethod: 'pickup' | 'delivery';
  pickupAddress?: string;
  pickupImage?: StaticImageData;
  readyTime: string;
  amountPaid: number;
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export function OrderConfirmedClient({
  orderNumber,
  sellerName,
  deliveryMethod,
  pickupAddress,
  pickupImage,
  readyTime,
  amountPaid,
}: OrderConfirmedClientProps) {
  const rows = [
    { label: 'Order number', value: orderNumber },
    { label: 'Seller', value: sellerName },
    { label: "How you'll get it", value: deliveryMethod === 'delivery' ? 'Delivered' : 'Pickup' },
    { label: 'Ready time', value: readyTime },
    { label: 'Amount paid', value: fmt(amountPaid) },
  ];

  return (
    <div className="min-h-screen bg-white px-5 pb-10 pt-14">
      {/* Close button */}
      <div className="flex justify-end">
        <Link
          href="/meals/m1"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      {/* Checkmark */}
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#209D01]">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-black">Order confirmed</h1>
        <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-neutral-500">
          Your order has been sent to the seller. You'll receive updates on WhatsApp.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {/* Pickup address card */}
        {deliveryMethod === 'pickup' && pickupAddress && (
          <div className="flex items-center gap-4 rounded-2xl border border-[#EDEDED] p-4">
            {pickupImage && (
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                <Image src={pickupImage} alt="Pickup location" fill className="object-cover" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-black">Pickup address</p>
              <p className="mt-0.5 text-sm text-neutral-500">{pickupAddress}</p>
            </div>
          </div>
        )}

        {/* Order details card */}
        <div className="rounded-2xl border border-[#EDEDED] p-4">
          <h2 className="mb-4 text-base font-bold text-black">Order details</h2>
          <div className="space-y-0">
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm text-neutral-500">{row.label}</span>
                  <span className="text-sm font-semibold text-black">{row.value}</span>
                </div>
                {i < rows.length - 1 && <div className="h-px bg-[#EDEDED]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-3">
        <Button
          variant="brand"
          className="flex h-13 w-full items-center justify-center gap-2.5 rounded-full text-sm font-semibold"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 1.667C5.398 1.667 1.667 5.398 1.667 10c0 1.488.39 2.885 1.073 4.094L1.667 18.333l4.356-1.055A8.29 8.29 0 0010 18.333c4.602 0 8.333-3.731 8.333-8.333S14.602 1.667 10 1.667zm0 1.5a6.833 6.833 0 110 13.666 6.814 6.814 0 01-3.511-.973l-.252-.154-2.585.626.663-2.526-.165-.263A6.814 6.814 0 013.167 10 6.833 6.833 0 0110 3.167zm-2.53 3.5c-.188 0-.492.07-.75.352-.258.281-.985 1.007-.985 2.453 0 1.447 1.008 2.845 1.149 3.04.14.196 1.97 3.136 4.838 4.27.675.273 1.203.436 1.614.558.678.202 1.296.173 1.784.105.544-.075 1.676-.714 1.913-1.404.235-.69.235-1.28.165-1.404-.07-.117-.258-.187-.539-.328-.282-.14-1.665-.856-1.923-.953-.258-.093-.446-.14-.633.14-.188.282-.727.953-.89 1.15-.164.195-.328.219-.609.07-.281-.14-1.185-.455-2.258-1.453-.834-.776-1.397-1.735-1.56-2.028-.164-.294-.017-.453.123-.598.126-.13.281-.34.422-.51.14-.168.187-.293.281-.492.094-.195.047-.365-.024-.51-.07-.14-.633-1.592-.867-2.18-.228-.57-.46-.493-.633-.502l-.538-.01z"
              fill="currentColor"
            />
          </svg>
          Chat with seller
        </Button>

        <Link
          href="/meals/m1"
          className="flex h-13 w-full items-center justify-center rounded-full border border-[#EDEDED] text-sm font-semibold text-black"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { OrderConfirmIcon, WhatsAppIcon } from '../icons';

interface OrderConfirmedClientProps {
  orderNumber: string;
  sellerName: string;
  sellerWhatsApp: string;
  chatMessage: string;
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
  sellerWhatsApp,
  chatMessage,
  deliveryMethod,
  pickupAddress,
  pickupImage,
  readyTime,
  amountPaid,
}: OrderConfirmedClientProps) {
  const chatHref = `https://wa.me/${sellerWhatsApp}?text=${encodeURIComponent(chatMessage)}`;
  const rows = [
    { label: 'Order number', value: orderNumber },
    { label: 'Seller', value: sellerName },
    { label: "How you'll get it", value: deliveryMethod === 'delivery' ? 'Delivered' : 'Pickup' },
    { label: 'Ready time', value: readyTime },
    { label: 'Amount paid', value: fmt(amountPaid) },
  ];

  return (
    <div className="min-h-screen bg-white px-5 pt-4 pb-44">
      {/* Close button */}
      <div className="flex justify-end">
        <Link
          href="/meals/m1"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000001A]"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M11 3L3 11M3 3l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>

      {/* Checkmark */}
      <div className="mt-2 flex flex-col items-center text-center">
        <Image
          src="/images/confirmed.gif"
          alt="Order confirmed"
          width={270}
          height={202}
          unoptimized
          className="-my-14"
        />

        <h1 className="mt-10 text-xl font-bold text-black">Order confirmed</h1>
        <p className="mt-4 max-w-xs text-base text-neutral-500">
          Your order has been sent to the seller. You&apos;ll receive updates on WhatsApp.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {/* Pickup address card */}
        {deliveryMethod === 'pickup' && pickupAddress && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#EDEDED] bg-white p-4 shadow-[0px_10px_20px_0px_#0000000D]">
            {pickupImage && <OrderConfirmIcon className="shrink-0" />}
            <div>
              <p className="text-base font-semibold text-black">Pickup address</p>
              <p className="mt-0.5 text-sm text-neutral-500">{pickupAddress}</p>
            </div>
          </div>
        )}

        {/* Order details card */}
        <div className="rounded-[20px] border border-[#EDEDED] bg-white p-4 shadow-[0px_4px_20px_0px_#0000000D]">
          <h2 className="mb-4 text-base font-semibold text-black">Order details</h2>
          <div className="-mx-4 h-px bg-[#EDEDED]" />
          <div className="space-y-0">
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm font-medium text-[#222222]">{row.label}</span>
                  <span className="text-sm font-medium text-[#222222]">{row.value}</span>
                </div>
                {i < rows.length - 1 && <div className="-mx-4 h-px bg-[#EDEDED]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 space-y-3 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <a
          href={chatHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'brand' }),
            'flex h-13 w-full items-center justify-center gap-2.5 rounded-full text-sm font-semibold',
          )}
        >
          <WhatsAppIcon className="h-5 w-5" />
          Chat with seller
        </a>

        <Link
          href="/meals/m1"
          className="flex h-13 w-full items-center justify-center rounded-full bg-[#F7F7F7] text-sm font-semibold text-black"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

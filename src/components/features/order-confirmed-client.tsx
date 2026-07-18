'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';

import { buttonVariants } from '@/components/ui/button';
import { clearCart } from '@/lib/cart';
import { cn } from '@/lib/utils';
import { getOrderDetails } from '@/lib/orders';
import type { OrderDetails } from '@/lib/orders';
import { OrderConfirmIcon, WhatsAppIcon } from '../icons';

interface OrderConfirmedClientProps {
  /** true/false = Paystack verification result; null = no reference (dev navigation). */
  paymentConfirmed?: boolean | null;
  /** When present, real order details are fetched to replace the fallbacks below. */
  orderId?: string;
  orderNumber: string;
  sellerId: string;
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
  paymentConfirmed = null,
  orderId,
  orderNumber,
  sellerId,
  sellerName,
  sellerWhatsApp,
  chatMessage,
  deliveryMethod: deliveryMethodProp,
  pickupAddress,
  pickupImage,
  readyTime,
  amountPaid,
}: OrderConfirmedClientProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);

  // The order is paid — the basket's job is done.
  useEffect(() => {
    if (paymentConfirmed) void clearCart();
  }, [paymentConfirmed]);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    // The phone used at checkout guards the order lookup.
    let phone = '';
    try {
      const raw = sessionStorage.getItem('checkout_details');
      phone = raw ? ((JSON.parse(raw).phone as string) ?? '') : '';
    } catch {
      // corrupt storage — skip the lookup
    }
    if (!phone) return;

    getOrderDetails(orderId, `0${phone.replace(/^0+/, '')}`).then((result) => {
      if (!cancelled && result) setOrder(result);
    });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // Prefer real order data; fall back to the props (mock/dev values).
  const deliveryMethod = order?.deliveryType ?? deliveryMethodProp;
  const displaySellerId = order?.cook.storeHandle ?? sellerId;
  const displaySellerName = order?.cook.storeName ?? sellerName;
  const displaySellerWhatsApp = order ? `234${order.cook.phone.replace(/^0+/, '')}` : sellerWhatsApp;
  const displayOrderNumber = order ? `#${order.id.slice(-6).toUpperCase()}` : orderNumber;
  const displayReadyTime = order
    ? `${new Date(order.readyDate).toLocaleDateString('en-NG', { weekday: 'long' })}, ${order.readyTime}`
    : readyTime;
  const displayAmountPaid = order ? Math.round(order.totalAmount) : amountPaid;
  const displayPickupAddress = order ? order.cook.kitchenAddress : pickupAddress;
  const displayChatMessage = order
    ? `Hi ${displaySellerName}, I just placed order ${displayOrderNumber} on GetaMeal.`
    : chatMessage;

  const chatHref = `https://wa.me/${displaySellerWhatsApp}?text=${encodeURIComponent(displayChatMessage)}`;
  const rows = [
    { label: 'Order number', value: displayOrderNumber },
    { label: 'Seller', value: displaySellerName },
    { label: "How you'll get it", value: deliveryMethod === 'delivery' ? 'Delivered' : 'Pickup' },
    { label: 'Ready time', value: displayReadyTime },
    { label: 'Amount paid', value: fmt(displayAmountPaid) },
  ];

  return (
    <div className="min-h-screen bg-white px-5 pt-4 pb-44">
      {/* Close button */}
      <div className="flex justify-end">
        <Link
          href={`/${displaySellerId}`}
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

      {/* Payment not confirmed banner */}
      {paymentConfirmed === false && (
        <div className="mt-4 rounded-2xl border border-[#FFD7D6] bg-[#FFF5F5] p-4">
          <p className="text-sm font-semibold text-[#B42318]">
            We couldn&apos;t confirm your payment yet
          </p>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            If you completed the payment, it may still be processing — check back shortly or reach
            out to us on WhatsApp.
          </p>
        </div>
      )}

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
        {deliveryMethod === 'pickup' && displayPickupAddress && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#EDEDED] bg-white p-4 shadow-[0px_10px_20px_0px_#0000000D]">
            {pickupImage && <OrderConfirmIcon className="shrink-0" />}
            <div>
              <p className="text-base font-semibold text-black">Pickup address</p>
              <p className="mt-0.5 text-sm text-neutral-500">{displayPickupAddress}</p>
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
          href={`/${displaySellerId}`}
          className="flex h-13 w-full items-center justify-center rounded-full bg-[#F7F7F7] text-sm font-semibold text-black"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

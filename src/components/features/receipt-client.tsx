'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';

import { Button } from '@/components/ui/button';
import { BackArrowIcon } from '../icons';

interface ReceiptAddOn {
  name: string;
  qty: number;
  price: number;
}

interface ReceiptItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  image: StaticImageData;
  addOns?: ReceiptAddOn[];
}

interface ReceiptClientProps {
  status: 'completed' | 'cancelled';
  deliveryMethod: 'pickup' | 'delivery';
  customerName: string;
  date: string;
  total: number;
  deliveryAddress?: string;
  pickupLocation?: string;
  pickupAddress?: string;
  items: ReceiptItem[];
  orderNumber: string;
  sellerName: string;
  readyTime: string;
  amountPaid: number;
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

const CARD = 'rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]';

export function ReceiptClient({
  status,
  deliveryMethod,
  customerName,
  date,
  total,
  deliveryAddress,
  pickupLocation,
  pickupAddress,
  items,
  orderNumber,
  sellerName,
  readyTime,
  amountPaid,
}: ReceiptClientProps) {
  const cancelled = status === 'cancelled';

  const rows = [
    { label: 'Order number', value: orderNumber },
    { label: 'Seller', value: sellerName },
    { label: "How you'll get it", value: deliveryMethod === 'delivery' ? 'Delivered' : 'Pickup' },
    { label: 'Ready time', value: readyTime },
    { label: 'Amount paid', value: fmt(amountPaid) },
  ];

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'GetaMeal receipt', url });
      } catch {
        // user dismissed the share sheet
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="relative flex items-center justify-center px-5 pt-8 pb-6">
        <Link
          href="/"
          className="absolute left-5 flex h-9 w-9 items-center justify-center"
          aria-label="Back"
        >
          <BackArrowIcon />
        </Link>
        <h1 className="text-base font-semibold text-black">
          {cancelled ? 'Cancelled receipt' : 'Receipt'}
        </h1>
      </div>

      {/* Brand + total */}
      <div className="flex items-start justify-between px-5 pt-4 pb-6">
        {/* TODO: replace with the Getameal logo SVG when available */}
        <p className="text-brand text-2xl font-bold">Getameal</p>
        <div className="text-right">
          <p className="text-base font-bold text-black">Total -{fmt(total)}</p>
          <p className="mt-0.5 text-sm text-neutral-500">{date}</p>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 pb-6">
        <p className="text-xl font-bold text-black">
          {cancelled ? 'Your order was cancelled' : 'Thanks for using Getameal'}
        </p>
        <p className="mt-1 text-3xl font-bold text-black">{customerName}</p>
      </div>

      <div className="space-y-4 px-4">
        {/* Refund notice (cancelled only) */}
        {cancelled && (
          <div className={`flex items-center gap-3 p-4 ${CARD}`}>
            <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 18.333a8.333 8.333 0 100-16.666 8.333 8.333 0 000 16.666z"
                stroke="#E11D48"
                strokeWidth="1.5"
              />
              <path
                d="M12.917 7.5H8.75a1.667 1.667 0 000 3.333h2.5a1.667 1.667 0 010 3.334H7.083M10 6.25v1.25m0 6.667v1.25"
                stroke="#E11D48"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm text-black">Refund sent to your original payment method.</p>
          </div>
        )}

        {/* Delivery / pickup details */}
        <div className={CARD}>
          <h2 className="p-4 text-base font-semibold text-black">
            {deliveryMethod === 'delivery' ? 'Delivery details' : 'Pick-up details'}
          </h2>
          <div className="h-px bg-[#EDEDED]" />
          <div className="p-4">
            {deliveryMethod === 'delivery' ? (
              <>
                <p className="text-sm font-medium text-black">{deliveryAddress}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  You&rsquo;ll get delivery updates on WhatsApp when your order is ready.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-black">Location: {pickupLocation}</p>
                <p className="mt-1 text-sm text-neutral-500">{pickupAddress}</p>
              </>
            )}
          </div>
        </div>

        {/* Your order */}
        <div className={`divide-y divide-[#EDEDED] ${CARD}`}>
          <h2 className="p-4 text-base font-semibold text-black">Your order</h2>

          {items.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-3 p-4">
                <div className="relative h-12.75 w-13.75 shrink-0 overflow-hidden rounded-[14px] bg-neutral-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{item.name}</p>
                  <p className="text-sm font-medium text-black">
                    Qty {item.qty} {item.unit} ·{' '}
                    <span className={cancelled ? 'line-through' : undefined}>
                      {fmt(item.price)}
                    </span>{' '}
                    each
                  </p>
                </div>
              </div>

              {item.addOns?.map((addon, i) => (
                <div key={i} className="mx-4 mb-4 rounded-[14px] border border-[#EDEDED] px-4 py-3">
                  <p className="text-sm font-semibold text-black">{addon.name}</p>
                  <p className="text-sm font-medium text-black">
                    Qty {addon.qty} ·{' '}
                    <span className={cancelled ? 'line-through' : undefined}>
                      {fmt(addon.price)}
                    </span>{' '}
                    each
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Order details */}
        <div className={CARD}>
          <h2 className="p-4 text-base font-semibold text-black">Order details</h2>
          <div className="h-px bg-[#EDEDED]" />
          <div className="px-4">
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm text-neutral-500">{row.label}</span>
                  <span className="text-sm font-medium text-black">{row.value}</span>
                </div>
                {i < rows.length - 1 && <div className="-mx-4 h-px bg-[#EDEDED]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => window.print()}
          className={`flex w-full items-center justify-between p-4 text-left ${CARD}`}
        >
          <span className="flex items-center gap-3">
            <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5.833 7.5V2.5h8.334v5m-8.334 7.5H4.167a1.667 1.667 0 01-1.667-1.666V10a2.5 2.5 0 012.5-2.5h10a2.5 2.5 0 012.5 2.5v3.334a1.667 1.667 0 01-1.667 1.666h-1.666m-8.334-2.5h8.334v5H5.833v-5z"
                stroke="#000"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-black">Download receipt</span>
          </span>
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 12l4-4-4-4"
              stroke="#888"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <a
          href="https://wa.me/2348000000000"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex w-full items-center justify-between p-4 ${CARD}`}
        >
          <span className="flex items-center gap-3">
            <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3.333 14.167v-3.334a6.667 6.667 0 0113.334 0v3.334m-11.667-2.5H2.5a.833.833 0 00-.833.833v1.667c0 .46.373.833.833.833h2.5v-3.333zm12.5 0h2.5c.46 0 .833.373.833.833v1.667c0 .46-.373.833-.833.833h-2.5v-3.333zm-1.666 3.333a2.5 2.5 0 01-2.5 2.5H10"
                stroke="#000"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-black">Get help</span>
          </span>
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 12l4-4-4-4"
              stroke="#888"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* Fixed share button */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          variant="brand"
          onClick={handleShare}
          className="h-13 w-full rounded-full text-sm font-semibold"
        >
          Share Receipt
        </Button>
      </div>
    </div>
  );
}

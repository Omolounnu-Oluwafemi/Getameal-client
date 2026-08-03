'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Toast } from '@/components/ui/toast';
import { getCart } from '@/lib/cart';
import { createOrder } from '@/lib/orders';
import { BackArrowIcon, OrderConfirmIcon } from '../icons';

interface KitchenInfo {
  name: string;
  location: string;
  ordersCompleted: number;
}

interface ConfirmPayClientProps {
  deliveryMethod: 'pickup' | 'delivery';
  deliveryFee: number;
  kitchenId: string;
  /** Shown for items without a photo — the cook's profile image or app icon. */
  fallbackImage: string;
  preparationDays: number;
  /** Weekday name the order will be ready — computed server-side. */
  readyDay: string;
  /** "HH:mm" — start of the store's pickup window. */
  readyTime: string;
  kitchen: KitchenInfo;
}

interface CheckoutDetails {
  name: string;
  phone: string;
  delivery: string;
  address: string;
  note: string;
}

interface OrderLine {
  id: string;
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  addOns: { name: string; price: number }[];
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

/** Collapse repeated add-on entries (one per unit) into name + count rows. */
function groupAddOns(addOns: OrderLine['addOns']) {
  const groups = new Map<string, { name: string; price: number; qty: number }>();
  for (const addOn of addOns) {
    const existing = groups.get(addOn.name);
    if (existing) {
      existing.qty += 1;
    } else {
      groups.set(addOn.name, { name: addOn.name, price: addOn.price, qty: 1 });
    }
  }
  return [...groups.values()];
}

export function ConfirmPayClient({
  deliveryMethod,
  deliveryFee,
  kitchenId,
  fallbackImage,
  preparationDays,
  readyDay,
  readyTime,
  kitchen,
}: ConfirmPayClientProps) {
  // null = cart still loading.
  const [items, setItems] = useState<OrderLine[] | null>(null);
  const [details] = useState<CheckoutDetails | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem('checkout_details');
      return raw ? (JSON.parse(raw) as CheckoutDetails) : null;
    } catch {
      return null;
    }
  });
  const [paying, setPaying] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getCart().then((cart) => {
      if (cancelled) return;
      setItems(
        (cart?.items ?? []).map((item) => ({
          id: item.productId,
          productId: item.productId,
          name: item.name,
          qty: item.quantity,
          price: Math.round(item.customerPrice),
          image: item.image,
          addOns: item.addOns.map((a) => ({ name: a.name, price: a.price })),
        })),
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const itemsTotal = (items ?? []).reduce(
    (sum, item) => sum + item.price * item.qty + item.addOns.reduce((s, a) => s + a.price, 0),
    0,
  );
  const shippingCost = deliveryMethod === 'delivery' ? deliveryFee : 0;
  const totalToPay = itemsTotal + shippingCost;
  // Extras, combined across every item in the order (rather than repeated
  // under each item), matching the "Your order" / "Extras" split elsewhere.
  const allAddOns = groupAddOns((items ?? []).flatMap((item) => item.addOns));

  async function handlePay() {
    if (paying || !items || items.length === 0) return;
    setPaying(true);

    const ready = new Date(Date.now() + preparationDays * 86_400_000);
    const [hours, minutes] = readyTime.split(':').map(Number);
    ready.setHours(hours || 12, minutes || 0, 0, 0);

    // The backend reads the items, store, and delivery fee from the cart.
    const order = await createOrder({
      customerName: details?.name || 'Guest',
      customerPhone: details?.phone ? `0${details.phone.replace(/^0+/, '')}` : '',
      customerNote: details?.note || undefined,
      deliveryType: deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? details?.address || undefined : undefined,
      readyDate: ready.toISOString(),
    });

    if (order?.paymentLink) {
      // Hand off to Paystack; keep the button disabled while the browser leaves.
      window.location.assign(order.paymentLink);
      return;
    }

    setPaying(false);
    setErrorVisible(true);
  }

  return (
    <div className="min-h-screen bg-white pb-36">
      {/* Header */}
      <div className="relative flex items-center justify-center px-5 pt-8 pb-10">
        <Link
          href={`/basket?kitchen=${kitchenId}`}
          className="absolute left-5 flex h-9 w-9 items-center justify-center"
          aria-label="Back"
        >
          <BackArrowIcon />
        </Link>
        <h1 className="text-base font-semibold text-black">Confirm and pay</h1>
      </div>

      {/* Kitchen info */}
      <div className="flex items-center gap-4 px-10 pb-5">
        <OrderConfirmIcon className="shrink-0" />
        <div>
          <p className="text-base font-bold text-black">{kitchen.name}</p>
          <p className="text-sm text-neutral-500">
            {kitchen.location} · {kitchen.ordersCompleted} orders completed
          </p>
        </div>
      </div>

      {/* How you'll get your order */}
      <div className="mx-4 rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]">
        <h2 className="my-4 px-5 text-base font-bold text-black">How you&apos;ll get your order</h2>

        <div className="h-px bg-[#EDEDED]" />

        <div className="my-4 px-5">
          <p className="text-base font-medium text-black">
            {deliveryMethod === 'delivery' ? `Delivery ${readyDay}` : 'Pickup — Free'}
          </p>
          <div className="mt-1 flex justify-between gap-4">
            <p
              className={`text-sm ${deliveryMethod === 'delivery' ? 'text-[#5C5C5C]' : 'text-neutral-500'}`}
            >
              {deliveryMethod === 'delivery'
                ? details?.address ||
                  'You’ll get delivery updates on WhatsApp when your order is ready.'
                : 'Pickup from ' + kitchen.location}
            </p>
            <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 12l4-4-4-4"
                stroke="#888"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      {deliveryMethod === 'pickup' && (
        <p className="mx-8 mt-3 text-sm text-[#797979]">
          Full pickup details will be shared after payment.
        </p>
      )}

      {/* Your order */}
      <div className="px-5 py-3">
        <div className="divide-y divide-[#EDEDED] rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]">
          <h2 className="p-4 text-base font-bold text-black">Your order</h2>

          {items === null ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="text-sm font-semibold text-black">Your basket is empty</p>
              <Link href={`/${kitchenId}`} className="text-brand text-sm font-semibold">
                Browse the kitchen
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className="relative h-12.75 w-13.75 shrink-0 overflow-hidden rounded-[14px] bg-neutral-100">
                  <Image
                    src={
                      item.image?.startsWith('https://res.cloudinary.com/')
                        ? item.image
                        : fallbackImage
                    }
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{item.name}</p>
                  <p className="text-sm font-medium text-black">
                    Qty {item.qty} · {fmt(item.price)} each
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Extras — combined across every item in the order */}
      {allAddOns.length > 0 && (
        <div className="px-5 py-3">
          <div className="divide-y divide-[#EDEDED] rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]">
            <h2 className="p-4 text-base font-bold text-black">Extras</h2>
            {allAddOns.map((addon) => (
              <div key={addon.name} className="p-4">
                <p className="text-sm text-neutral-500">{addon.name}</p>
                <p className="text-sm font-semibold text-black">
                  Qty {addon.qty} · {fmt(addon.price)} each
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price details */}
      <div className="px-5 py-3">
        <div className="rounded-[20px] border border-[#EDEDED] bg-white p-4 shadow-[0px_4px_20px_0px_#0000000D]">
          <h2 className="mb-4 text-base font-bold text-black">Price details</h2>
          <div className="mb-4 h-px bg-[#EDEDED]" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Items total</span>
              <span className="text-sm font-semibold text-black">{fmt(itemsTotal)}</span>
            </div>
            <div className="h-px bg-[#EDEDED]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                {deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
              </span>
              <span className="text-sm font-bold text-black">
                {shippingCost === 0 ? 'Free' : fmt(shippingCost)}
              </span>
            </div>
            <div className="h-px bg-[#EDEDED]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Total to pay</span>
              <span className="text-sm font-bold text-black">{fmt(totalToPay)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-500">A small service fee is added at payment.</p>
        </div>
      </div>

      <p className="mt-2 px-5 text-xs leading-relaxed text-[#5C5C5C]">
        By paying, you confirm this order and allow the seller to start preparing it.
      </p>

      {/* Fixed pay button */}
      <div className="fixed inset-x-0 bottom-0 z-30 px-5 pt-4 pb-10">
        <Button
          variant="brand"
          onClick={handlePay}
          disabled={paying || !items || items.length === 0}
          className="h-13 w-full rounded-full text-sm font-semibold disabled:opacity-50"
        >
          {paying ? (
            <Spinner className="h-5 w-5 border-2 border-white/30 border-t-white" />
          ) : (
            `Pay — ${fmt(totalToPay)}`
          )}
        </Button>
      </div>

      {errorVisible && (
        <Toast
          message="Couldn't create your order. Please try again."
          onClose={() => setErrorVisible(false)}
        />
      )}
    </div>
  );
}

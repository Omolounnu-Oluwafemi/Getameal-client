'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Toast } from '@/components/ui/toast';
import { createFoodRequest } from '@/lib/orders';
import { OrderConfirmIcon } from '../icons';

interface Kitchen {
  name: string;
  location: string;
  ordersCompleted: number;
}

interface CustomOrderCheckoutClientProps {
  kitchen: Kitchen;
  kitchenId: string;
  cookId: string;
}

/** Written by the custom order form; submitted from this preview page. */
interface StoredRequest {
  foodRequest: string;
  notes: string;
  name: string;
  /** Digits only, no leading zero. */
  phone: string;
  readyDate: string;
  deliveryType: 'pickup' | 'delivery';
  address: string;
}

export function CustomOrderCheckoutClient({
  kitchen,
  kitchenId,
  cookId,
}: CustomOrderCheckoutClientProps) {
  const router = useRouter();
  // undefined = still reading storage; null = nothing stored (direct visit).
  const [request, setRequest] = useState<StoredRequest | null | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('custom_order_request');
      setRequest(raw ? (JSON.parse(raw) as StoredRequest) : null);
    } catch {
      setRequest(null);
    }
  }, []);

  async function handleSubmit() {
    if (submitting || !request) return;
    setSubmitting(true);

    const result = await createFoodRequest({
      cookId,
      customerName: request.name,
      customerPhone: `0${request.phone}`,
      customerNote: request.notes || undefined,
      deliveryType: request.deliveryType,
      deliveryAddress: request.deliveryType === 'delivery' ? request.address : undefined,
      readyDate: request.readyDate,
      foodRequest: request.foodRequest,
    });

    if (result) {
      // Let the shared order-confirmed page look the order up.
      sessionStorage.setItem(
        'checkout_details',
        JSON.stringify({
          name: request.name,
          phone: request.phone,
          delivery: request.deliveryType,
          address: request.address,
          note: request.notes,
        }),
      );
      sessionStorage.removeItem('custom_order_request');
      router.push(`/order-confirmed?method=${request.deliveryType}&orderId=${result.id}`);
      return;
    }

    setSubmitting(false);
    setErrorVisible(true);
  }

  if (request === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (request === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-5 text-center">
        <p className="text-base font-semibold text-black">No request to review</p>
        <Link href={`/${kitchenId}/custom-order`} className="text-brand text-sm font-semibold">
          Start a custom order
        </Link>
      </div>
    );
  }

  const readyBy = new Date(request.readyDate).toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen bg-white pb-32">
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
          <p className="p-4 text-sm font-semibold text-black">{request.foodRequest}</p>
        </div>

        {/* Customer details */}
        <div className="rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]">
          <h2 className="p-4 text-base font-semibold text-black">Customer details</h2>
          <div className="h-px bg-[#EDEDED]" />
          <div className="space-y-5 p-4">
            <div>
              <p className="text-sm text-[#5C5C5C]">Full name</p>
              <p className="mt-0.5 text-base font-medium text-black">{request.name}</p>
            </div>
            <div>
              <p className="text-sm text-[#5C5C5C]">WhatsApp number</p>
              <p className="mt-0.5 text-base font-medium text-black">+234{request.phone}</p>
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
                {request.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
              </p>
            </div>
            {request.deliveryType === 'delivery' && (
              <div>
                <p className="text-sm text-[#5C5C5C]">Delivery address</p>
                <p className="mt-0.5 text-base font-medium text-black">{request.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed submit button */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          variant="brand"
          onClick={handleSubmit}
          disabled={submitting}
          className="h-13 w-full rounded-full text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? (
            <Spinner className="h-5 w-5 border-2 border-white/30 border-t-white" />
          ) : (
            'Send request'
          )}
        </Button>
      </div>

      {errorVisible && (
        <Toast
          message="Couldn't send your request. Please try again."
          onClose={() => setErrorVisible(false)}
        />
      )}
    </div>
  );
}

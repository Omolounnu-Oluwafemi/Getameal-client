'use client';

import { Button } from '@/components/ui/button';
import type { OrderDetails } from '@/lib/orders';
import { OrderConfirmIcon } from '../icons';

const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`;

const CARD = 'rounded-[20px] border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000000D]';

export function CustomOrderPaymentClient({ order }: { order: OrderDetails }) {
  const readyBy = new Date(order.readyDate).toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const payLink = order.rawPaymentLink || order.paymentLink;
  const alreadyPaid = order.isPaid || order.paymentStatus === 'paid';

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Kitchen info */}
      <div className="flex items-center gap-2 px-5 py-6">
        <OrderConfirmIcon className="shrink-0" />
        <div>
          <p className="text-base font-bold text-black">{order.cook.storeName}</p>
          <p className="text-sm text-neutral-500">{order.cook.kitchenAddress}</p>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {/* Your order */}
        <div className={CARD}>
          <h2 className="p-4 text-base font-semibold text-black">Your order</h2>
          <div className="h-px bg-[#EDEDED]" />
          {order.customOrderTitle ? (
            <div className="space-y-1 p-4">
              <p className="text-sm font-semibold text-black">{order.customOrderTitle}</p>
              {order.customOrderDescription && (
                <p className="text-sm text-neutral-500">{order.customOrderDescription}</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#EDEDED]">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-black">{item.name}</p>
                    <p className="text-sm text-neutral-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-black">{fmt(item.subtotal)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer details */}
        <div className={CARD}>
          <h2 className="p-4 text-base font-semibold text-black">Customer details</h2>
          <div className="h-px bg-[#EDEDED]" />
          <div className="space-y-5 p-4">
            <div>
              <p className="text-sm text-[#5C5C5C]">Full name</p>
              <p className="mt-0.5 text-base font-medium text-black">
                {order.customer?.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#5C5C5C]">WhatsApp number</p>
              <p className="mt-0.5 text-base font-medium text-black">{order.customer?.phone}</p>
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className={CARD}>
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
                {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
              </p>
            </div>
            {order.deliveryType === 'delivery' && order.deliveryAddress && (
              <div>
                <p className="text-sm text-[#5C5C5C]">Delivery address</p>
                <p className="mt-0.5 text-base font-medium text-black">
                  {order.deliveryAddress}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price details */}
        <div className={CARD}>
          <h2 className="p-4 text-base font-semibold text-black">Price details</h2>
          <div className="h-px bg-[#EDEDED]" />
          <div className="space-y-3 p-4">
            {order.subtotal !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <p className="text-[#5C5C5C]">Subtotal</p>
                <p className="font-medium text-black">{fmt(order.subtotal)}</p>
              </div>
            )}
            {order.deliveryType === 'delivery' && (
              <div className="flex items-center justify-between text-sm">
                <p className="text-[#5C5C5C]">Delivery fee</p>
                <p className="font-medium text-black">{fmt(order.deliveryFee)}</p>
              </div>
            )}
            {!!order.serviceFee && (
              <div className="flex items-center justify-between text-sm">
                <p className="text-[#5C5C5C]">Service fee</p>
                <p className="font-medium text-black">{fmt(order.serviceFee)}</p>
              </div>
            )}
            <div className="h-px bg-[#EDEDED]" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-black">Total</p>
              <p className="text-base font-bold text-black">{fmt(order.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed pay button */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {alreadyPaid ? (
          order.receiptUrl ? (
            <a href={order.receiptUrl}>
              <Button variant="brand" className="h-13 w-full rounded-full text-sm font-semibold">
                View receipt
              </Button>
            </a>
          ) : (
            <p className="py-3 text-center text-sm font-semibold text-black">
              This order has already been paid for.
            </p>
          )
        ) : payLink ? (
          <a href={payLink}>
            <Button variant="brand" className="h-13 w-full rounded-full text-sm font-semibold">
              Pay - {fmt(order.totalAmount)}
            </Button>
          </a>
        ) : (
          <p className="py-3 text-center text-sm text-neutral-500">
            Payment isn&apos;t ready for this order yet.
          </p>
        )}
      </div>
    </div>
  );
}

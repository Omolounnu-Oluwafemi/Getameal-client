'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type DeliveryOption = 'pickup' | 'delivery' | null;

interface CheckoutSheetProps {
  onClose: () => void;
  kitchenId: string;
  deliveryFee?: number;
}

export function CheckoutSheet({ onClose, kitchenId, deliveryFee = 2300 }: CheckoutSheetProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [delivery, setDelivery] = useState<DeliveryOption>(null);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // The sheet is 90vh tall, but the on-screen keyboard shrinks the *visible*
  // viewport without shrinking the layout. Clamp the sheet to the visible
  // height so the pinned CTA sits above the keyboard and the body scrolls
  // instead of being covered.
  useEffect(() => {
    const vv = window.visualViewport;
    const sheet = sheetRef.current;
    if (!vv || !sheet) return;

    const update = () => {
      sheet.style.maxHeight = `${vv.height}px`;
    };

    update();
    vv.addEventListener('resize', update);
    return () => vv.removeEventListener('resize', update);
  }, []);

  function handleContinue() {
    if (!delivery) return;
    // Read on the confirm-and-pay page when creating the order.
    sessionStorage.setItem(
      'checkout_details',
      JSON.stringify({ name, phone, delivery, address, note }),
    );
    router.push(`/checkout?method=${delivery}&kitchen=${kitchenId}`);
  }

  const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

  const deliveryLabel =
    delivery === 'pickup'
      ? 'Pickup - Free'
      : delivery === 'delivery'
        ? `Delivery - ${fmt(deliveryFee)}`
        : 'Select option';

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm your order"
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 z-50 flex h-[90vh] flex-col rounded-t-3xl bg-white shadow-[0px_6px_20px_0px_#0000000D]"
        onFocusCapture={(e) => {
          const field = e.target;
          if (field.matches('input, textarea')) {
            // Wait for the keyboard animation, then nudge the field into the
            // now-smaller visible area if it isn't fully in view.
            setTimeout(() => field.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 300);
          }
        }}
      >
        {/* Drag handle */}
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1.5 w-16 rounded-full bg-[#989898]" />
        </div>

        {/* Pinned header — stays put while the body scrolls */}
        <div className="relative flex shrink-0 items-center justify-center px-12 pt-4 pb-4">
          <h2 className="text-center text-base leading-tight font-semibold text-[#0F0F0F]">
            How should we confirm your order?
          </h2>
          <button
            onClick={onClose}
            className="absolute top-1/2 right-5 flex h-8 w-8 shrink-0 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white"
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
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pt-2 pb-6">
          <p className="w-[80%] px-5 pb-4 text-sm text-black">
            Enter your details and choose how you want to receive your order.
          </p>

          <div className="space-y-5 px-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">Your name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* WhatsApp number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">WhatsApp number</label>
              <div className="flex h-12.5 items-center overflow-hidden rounded-full border border-[#E1E1E1] bg-white">
                <span className="flex h-full shrink-0 items-center border-r border-[#E1E1E1] bg-[#F7F7F7] px-4 text-sm text-neutral-500">
                  +234
                </span>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-full flex-1 [appearance:textfield] rounded-none border-0 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                We&rsquo;ll send your order updates on WhatsApp.
              </p>
            </div>

            {/* Delivery method */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                How will you get your order?
              </label>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-full border border-[#EDEDED] px-4 py-3.5 text-sm"
                >
                  <span className={delivery ? 'text-black' : 'text-neutral-400'}>
                    {deliveryLabel}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 6l4-4 4 4M4 10l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000001A]">
                    <button
                      onClick={() => {
                        setDelivery('pickup');
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-neutral-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-black">Pickup - Free</p>
                        <p className="text-xs text-neutral-500">
                          Collect from the seller&rsquo;s pickup location.
                        </p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 12l4-4-4-4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="mx-4 h-px bg-[#EDEDED]" />
                    <button
                      onClick={() => {
                        setDelivery('delivery');
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-neutral-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-black">
                          Delivery - {fmt(deliveryFee)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Get it delivered to your address.
                        </p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 12l4-4-4-4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery address */}
            {delivery === 'delivery' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Delivery address
                </label>
                <Input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Note for the seller
              </label>
              <Textarea
                placeholder="Enter note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 border-t border-[#EDEDED] px-5 pt-4 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1rem))]">
          <Button
            variant="brand"
            onClick={handleContinue}
            disabled={!delivery}
            className="h-13 w-full rounded-full text-sm font-semibold disabled:opacity-50"
          >
            Continue to payment
          </Button>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type DeliveryOption = 'pickup' | 'delivery' | null;

interface CheckoutSheetProps {
  onClose: () => void;
  deliveryFee?: number;
}

export function CheckoutSheet({ onClose, deliveryFee = 2300 }: CheckoutSheetProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [delivery, setDelivery] = useState<DeliveryOption>(null);
  const [note, setNote] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleContinue() {
    if (!delivery) return;
    router.push(`/checkout?method=${delivery}`);
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
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm your order"
        className="fixed inset-x-0 bottom-[-20] z-50 flex max-h-[92vh] flex-col rounded-t-3xl bg-white shadow-[0px_6px_20px_0px_#0000000D]"
      >
        {/* Drag handle */}
        <div className="flex flex-shrink-0 justify-center pb-1 pt-3">
          <div className="h-1.5 w-16 rounded-full bg-[#C3C3C3]" />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pb-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-4">
            <h2 className="text-xl font-semibold leading-tight text-black">How should we confirm your order?</h2>
            <button
              onClick={onClose}
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <p className="px-5 pb-6 text-sm text-neutral-600">
            Enter your details and choose how you want to receive your order.
          </p>

          <div className="space-y-5 px-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">Your name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-[#EDEDED] px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none"
              />
            </div>

            {/* WhatsApp number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">WhatsApp number</label>
              <div className="flex items-center overflow-hidden rounded-full border border-[#EDEDED]">
                <span className="flex-shrink-0 border-r border-[#EDEDED] px-4 py-3.5 text-sm text-neutral-500">
                  +234
                </span>
                <input
                  type="tel"
                  placeholder="Enter number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">We'll send your order updates on WhatsApp.</p>
            </div>

            {/* Delivery method */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">How will you get your order?</label>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-full border border-[#EDEDED] px-4 py-3.5 text-sm"
                >
                  <span className={delivery ? 'text-black' : 'text-neutral-400'}>{deliveryLabel}</span>
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
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000001A]">
                    <button
                      onClick={() => {
                        setDelivery('pickup');
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-neutral-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-black">Pickup - Free</p>
                        <p className="text-xs text-neutral-500">Collect from the seller's pickup location.</p>
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
                        <p className="text-sm font-semibold text-black">Delivery - {fmt(deliveryFee)}</p>
                        <p className="text-xs text-neutral-500">Get it delivered to your address.</p>
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

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black">Note for the seller</label>
              <textarea
                placeholder="Enter note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-2xl border border-[#EDEDED] px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 border-t border-[#EDEDED] px-5 pb-10 pt-4">
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

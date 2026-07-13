'use client';

import { useState } from 'react';

interface QuantitySheetProps {
  unit: string;
  price: number;
  onClose: () => void;
  onConfirm: (qty: number) => void;
  onQtyChange?: (qty: number) => void;
  /** Starting quantity — pass the current qty when editing an added extra. */
  initialQty?: number;
  /** Lowest selectable quantity; 0 lets the user remove an added extra. */
  minQty?: number;
}

export function QuantitySheet({
  unit,
  price,
  onClose,
  onConfirm,
  onQtyChange,
  initialQty = 1,
  minQty = 1,
}: QuantitySheetProps) {
  const [qty, setQty] = useState(initialQty);

  function changeQty(next: number) {
    setQty(next);
    onQtyChange?.(next);
  }

  const formatted = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

  function handleConfirm() {
    onConfirm(qty);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card — all corners rounded, floats above bottom edge */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Select Quantity"
        className="fixed inset-x-0 bottom-[-20] z-50 flex h-112 flex-col gap-6 rounded-t-3xl border border-[#EDEDED] bg-white pt-1.75 pr-4 pb-13 pl-4 shadow-[0px_6px_20px_0px_#0000000D]"
      >
        {/* Drag handle */}
        <div className="flex justify-center">
          <div className="h-2 w-15.5 rounded-full bg-[#C3C3C3]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">Select Quantity</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
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

        {/* Quantity controls */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-10">
            <button
              onClick={() => changeQty(Math.max(minQty, qty - 1))}
              disabled={qty <= minQty}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl font-light text-neutral-600 transition-colors hover:bg-neutral-200 disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span className="min-w-16 text-center text-7xl font-bold text-neutral-900">{qty}</span>

            <button
              onClick={() => changeQty(qty + 1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl font-light text-neutral-600 transition-colors hover:bg-neutral-200"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <span className="text-sm text-neutral-500">{unit}</span>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          className={`w-full rounded-full py-4 text-base font-semibold text-white transition-all active:scale-[0.98] ${
            qty === 0 ? 'bg-[#FA2A26] hover:bg-[#d92320]' : 'bg-brand hover:bg-brand-dark'
          }`}
        >
          {qty === 0 ? 'Remove extra' : `Add ${qty} ${unit} — ${formatted(price * qty)}`}
        </button>
      </div>
    </>
  );
}

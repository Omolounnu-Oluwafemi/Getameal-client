'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { OrderConfirmIcon } from '../icons';

interface LeaveReviewClientProps {
  orderId: string;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  ordersCompleted: number;
  customerName: string;
  whatsappNumber: string;
}

export function LeaveReviewClient({
  orderId,
  sellerId,
  sellerName,
  sellerLocation,
  ordersCompleted,
  customerName,
  whatsappNumber,
}: LeaveReviewClientProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  function handleSubmit() {
    if (!rating) return;
    // TODO: POST { orderId, sellerId, customerName, whatsappNumber, rating, comment }
    // to the reviews API when the backend is ready.
    void orderId;
    void customerName;
    void whatsappNumber;
    void comment;
    router.push(`/${sellerId}/reviews`);
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="relative flex items-center justify-center px-5 pt-8 pb-4">
        <Link
          href={`/${sellerId}`}
          className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000001A]"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M11 3L3 11M3 3l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-black">Leave a review</h1>
      </div>

      {/* Kitchen card */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-2 rounded-[20px] border border-[#EDEDED] bg-white p-4 shadow-[0px_4px_20px_0px_#0000000D]">
          <OrderConfirmIcon className="shrink-0" />
          <div>
            <p className="text-base font-bold text-black">{sellerName}</p>
            <p className="text-sm text-neutral-500">
              {sellerLocation} · {ordersCompleted} orders completed
            </p>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="px-5 pt-8">
        <h2 className="text-2xl leading-snug font-bold text-black">
          How was your order from {sellerName}?
        </h2>
        <p className="mt-3 text-sm text-black">It takes less than a minute.</p>
      </div>

      {/* Star picker */}
      <div className="flex justify-center gap-4 px-5 pt-14 pb-10">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`h-12 w-12 transition-colors ${
                star <= rating ? 'text-[#E2542C]' : 'text-[#D9D9D9]'
              }`}
            >
              <path d="M12 2.5l2.94 5.955 6.573.955-4.756 4.635 1.122 6.545L12 17.5l-5.879 3.09 1.122-6.545L2.487 9.41l6.572-.955L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>

      {/* Comment */}
      <div className="px-5 pt-4">
        <label className="mb-2 block text-sm text-black">Comment</label>
        <Textarea
          placeholder="Enter comment here"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Fixed submit button */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          variant="brand"
          onClick={handleSubmit}
          disabled={!rating}
          className="h-13 w-full rounded-full text-sm font-semibold disabled:opacity-50"
        >
          Submit review
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Toast } from '@/components/ui/toast';
import { submitReview } from '@/lib/reviews';
import { OrderConfirmIcon, StarIcon } from '../icons';

interface LeaveReviewClientProps {
  orderId: string;
  sellerId: string;
  cookId: string;
  sellerName: string;
  sellerLocation: string;
  ordersCompleted: number;
  customerName: string;
  whatsappNumber: string;
}

export function LeaveReviewClient({
  orderId,
  sellerId,
  cookId,
  sellerName,
  sellerLocation,
  ordersCompleted,
  customerName,
  whatsappNumber,
}: LeaveReviewClientProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // The reviews API requires the customer's phone — the WhatsApp review link
  // carries it as a query param.
  const phoneDigits = whatsappNumber.replace(/\D/g, '');
  const canSubmit = rating > 0 && phoneDigits.length >= 10;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const result = await submitReview({
      targetId: cookId,
      targetType: 'cook',
      rating,
      comment: comment.trim(),
      customerName,
      customerPhone: `0${phoneDigits.replace(/^0+/, '')}`,
      orderId,
      storeHandle: sellerId,
    });

    if ('review' in result) {
      router.push(`/${sellerId}/reviews`);
      return;
    }

    setSubmitting(false);
    setErrorMessage(result.error);
  }

  return (
    <div className="min-h-screen bg-white pb-56">
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
        <h2 className="text-[20px] leading-snug font-bold text-black">
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
            <StarIcon
              className={`h-12 w-12 transition-all ${star <= rating ? '' : 'opacity-30 grayscale'}`}
            />
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
          onFocus={(e) => {
            // Wait for the keyboard animation, then lift the field above the
            // fixed submit bar.
            const el = e.target;
            setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
          }}
        />
      </div>

      {/* Fixed submit button */}
      <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-[20px] bg-white px-5 pt-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] shadow-[0px_-4px_20px_0px_#0000000D]">
        <Button
          variant="brand"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="h-13 w-full rounded-full text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? (
            <Spinner className="h-5 w-5 border-2 border-white/30 border-t-white" />
          ) : (
            'Submit review'
          )}
        </Button>
      </div>

      {errorMessage && <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />}
    </div>
  );
}

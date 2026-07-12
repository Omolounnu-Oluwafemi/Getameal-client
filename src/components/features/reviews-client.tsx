'use client';

import { useState } from 'react';
import Link from 'next/link';

import { BackArrowIcon } from '../icons';

export interface Review {
  id: string;
  name: string;
  rating: number;
  timeAgo: string;
  lead: string;
  body: string;
}

interface ReviewsClientProps {
  kitchenId: string;
  rating: number;
  reviewCount: number;
  /** Percent of reviews per star, from 5 stars down to 1. */
  distribution: number[];
  reviews: Review[];
}

function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${filled ? 'text-[#E2542C]' : 'text-[#D9D9D9]'} ${className ?? 'h-4 w-4'}`}
    >
      <path d="M12 2.5l2.94 5.955 6.573.955-4.756 4.635 1.122 6.545L12 17.5l-5.879 3.09 1.122-6.545L2.487 9.41l6.572-.955L12 2.5z" />
    </svg>
  );
}

function StarRow({ rating, starClass }: { rating: number; starClass?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= Math.round(rating)} className={starClass} />
      ))}
    </div>
  );
}

export function ReviewsClient({
  kitchenId,
  rating,
  reviewCount,
  distribution,
  reviews,
}: ReviewsClientProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasReviews = reviewCount > 0;

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Header */}
      <div className="relative flex items-center justify-center px-5 pt-8 pb-6">
        <Link
          href={`/${kitchenId}`}
          className="absolute left-5 flex h-9 w-9 items-center justify-center"
          aria-label="Back"
        >
          <BackArrowIcon />
        </Link>
        <h1 className="text-base font-semibold text-black">Reviews</h1>
      </div>

      {/* Overall rating squircle — tap to see the breakdown */}
      <div className="flex justify-center px-5 py-6">
        <button
          onClick={() => setSheetOpen(true)}
          className="rounded-[48px] bg-[#FAFAFA] p-4 shadow-[0px_10px_30px_0px_#0000000D]"
          aria-label="See rating breakdown"
        >
          <div className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-[36px] bg-white shadow-[0px_4px_20px_0px_#0000000A]">
            {hasReviews && <p className="text-sm font-semibold text-black">Overall Rating</p>}
            <p className="text-4xl font-bold text-black">{rating.toFixed(1)}</p>
            <StarRow rating={hasReviews ? rating : 0} />
          </div>
        </button>
      </div>

      {/* Review list */}
      <div className="border-t border-[#F2F2F2] px-5 pt-5">
        <h2 className="text-base font-bold text-black">
          {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
        </h2>

        {hasReviews ? (
          <div className="mt-4 space-y-8">
            {reviews.map((review) => (
              <div key={review.id}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#222222] text-sm font-semibold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <p className="text-base font-semibold text-black">{review.name}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StarRow rating={review.rating} starClass="h-5 w-5" />
                  <p className="text-sm text-neutral-500">{review.timeAgo}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black">
                  <span className="font-semibold">{review.lead}</span> {review.body}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="relative mt-16 flex flex-col items-center overflow-hidden pb-24">
            <div className="absolute bottom-0 left-1/2 h-40 w-64 -translate-x-1/2">
              <div className="absolute left-0 h-32 w-32 rounded-full bg-[#FE4141]/20 blur-2xl" />
              <div className="absolute right-0 h-32 w-32 rounded-full bg-[#209D01]/20 blur-2xl" />
            </div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-[0px_10px_25px_0px_#00000014]">
              🌟
            </div>
            <p className="relative mt-5 text-base font-semibold text-black">No reviews yet</p>
          </div>
        )}
      </div>

      {/* Rating breakdown sheet */}
      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Overall rating"
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white px-5 pt-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="relative flex items-center justify-center">
              <h2 className="text-lg font-bold text-black">Overall rating</h2>
              <button
                onClick={() => setSheetOpen(false)}
                className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white"
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
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#F7F7F7] px-4 py-3.5">
              {hasReviews && <StarRow rating={rating} starClass="h-5 w-5" />}
              <p className="text-sm text-black">
                <span className="font-bold">{hasReviews ? rating.toFixed(1) : 0}</span> out of{' '}
                <span className="font-bold">5.0</span>
              </p>
            </div>

            <p className="mt-4 text-center text-sm font-semibold text-black">
              {reviewCount} Customer {reviewCount === 1 ? 'Review' : 'Reviews'}
            </p>

            <div className="mt-5 space-y-3.5">
              {distribution.map((percent, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-3 text-sm text-black">{5 - i}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#F2F2F2]">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: hasReviews ? `${percent}%` : 0 }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm text-black">{percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

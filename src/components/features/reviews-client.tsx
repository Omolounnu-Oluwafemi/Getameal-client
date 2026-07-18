'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BackArrowIcon, NoReview, StarIcon } from '../icons';

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

/** The app's shared star icon — greyed out via CSS when unfilled. */
function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <StarIcon className={`${className ?? 'h-4 w-4'} ${filled ? '' : 'opacity-30 grayscale'}`} />
  );
}

/** Review body clamped to 4 lines, with "See More" only when it overflows. */
function ReviewText({ lead, body }: { lead: string; body: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, []);

  return (
    <div className="relative mt-3">
      <p
        ref={textRef}
        className={`text-sm leading-relaxed text-black ${expanded ? '' : 'line-clamp-4'}`}
      >
        {lead && <span className="font-semibold">{lead} </span>}
        {body}
        {expanded && (
          <>
            {' '}
            <button onClick={() => setExpanded(false)} className="text-sm font-bold text-black">
              See Less
            </button>
          </>
        )}
      </p>
      {!expanded && overflowing && (
        <button
          onClick={() => setExpanded(true)}
          className="absolute right-0 bottom-0 bg-white pl-3 text-sm leading-relaxed font-bold text-black"
        >
          See More
        </button>
      )}
    </div>
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-center px-5 pt-8 pb-2">
        <Link
          href={`/${kitchenId}`}
          className="absolute left-5 flex h-5 w-5 items-center justify-center"
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
          className="flex h-49.5 w-51.25 items-center justify-center rounded-[55px] bg-white shadow-[inset_0px_4px_10px_0px_#00000033]"
          aria-label="See rating breakdown"
        >
          <div className="flex min-h-42.25 w-43.75 flex-col items-center justify-center gap-1 rounded-[40px] border border-[#EDEDED] bg-white px-4 py-7.5 shadow-[0px_4px_30px_0px_#0000001A]">
            {hasReviews && <p className="text-base font-semibold text-black">Overall Rating</p>}
            <p className="text-[40px] font-bold text-black">{rating.toFixed(1)}</p>
            <StarRow rating={hasReviews ? rating : 0} />
          </div>
        </button>
      </div>

      {/* Review list */}
      <div className="rounded-t-[20px] bg-white px-4 pt-5 pb-6 shadow-[0px_4px_30px_0px_#0000000D]">
        <h2 className="pb-4 text-base font-bold text-black">
          {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
        </h2>

        {hasReviews ? (
          <div className="mt-4 space-y-8">
            {reviews.map((review) => (
              <div key={review.id}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-[#222222] text-sm font-semibold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <p className="text-[15px] font-semibold text-black">{review.name}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StarRow rating={review.rating} starClass="h-5 w-5" />
                  <p className="text-[12px] font-medium text-[#797979]">{review.timeAgo}</p>
                </div>
                <ReviewText lead={review.lead} body={review.body} />
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
            <NoReview className="relative" />
            <p className="relative mt-2 text-base font-semibold text-black">No reviews yet</p>
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
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white px-4 pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="relative flex items-center justify-center">
              <h2 className="text-[20px] font-bold text-black">Overall rating</h2>
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

            <div className="mx-auto mt-5 flex w-fit max-w-full items-center justify-center gap-2 rounded-[60px] bg-[#F7F7F7] px-6 py-3.5">
              {/* Invisible when empty so the pill keeps its populated-state shape */}
              <span className={hasReviews ? undefined : 'invisible'}>
                <StarRow rating={rating} starClass="h-5 w-5 shrink-0" />
              </span>
              <p className="text-sm whitespace-nowrap text-black">
                <span className="font-bold">{hasReviews ? rating.toFixed(1) : 0}</span> out of{' '}
                <span className="font-bold">5.0</span>
              </p>
            </div>

            <p className="mt-4 text-center text-lg font-semibold text-black">
              {reviewCount} Customer {reviewCount === 1 ? 'Review' : 'Reviews'}
            </p>

            <div className="mt-5 space-y-3.5">
              {distribution.map((percent, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-3 text-sm font-medium text-black">{5 - i}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#F2F2F2]">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: hasReviews ? `${percent}%` : 0 }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-black">{percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

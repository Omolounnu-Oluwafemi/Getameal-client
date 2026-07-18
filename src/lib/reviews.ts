// Client-side review helpers — talk to the getcooks reviews API through the
// /api/reviews proxy route.

export interface SubmitReviewInput {
  targetId: string;
  targetType: 'cook';
  rating: number;
  comment: string;
  customerName: string;
  customerPhone: string;
  orderId: string;
  /** Store handle — used by the proxy to refresh the reviews page cache. */
  storeHandle: string;
}

export interface SubmittedReview {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
}

interface SubmitReviewResponse {
  success: boolean;
  message?: string;
  review?: SubmittedReview;
}

export type SubmitReviewResult = { review: SubmittedReview } | { error: string };

/**
 * Submit a review for a cook. On failure, `error` carries the backend's
 * message (e.g. "You can only review cooks you have ordered from") so the
 * user sees the real reason.
 */
export async function submitReview(input: SubmitReviewInput): Promise<SubmitReviewResult> {
  console.log('Submit review payload:', JSON.stringify(input, null, 2));

  const fallback = 'Couldn’t submit your review. Please try again.';

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const data = (await res.json().catch(() => null)) as
      | (SubmitReviewResponse & { message?: string })
      | null;

    if (res.ok && data?.success && data.review) {
      return { review: data.review };
    }

    console.error('Submit review failed:', res.status, data);
    return { error: data?.message || fallback };
  } catch (error) {
    console.error('Failed to submit review:', error);
    return { error: 'Couldn’t reach the server. Please check your connection and try again.' };
  }
}

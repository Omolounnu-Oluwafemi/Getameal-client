import { notFound } from 'next/navigation';

import { ReviewsClient } from '@/components/features/reviews-client';
import { getCookReviews, getStore, timeAgo } from '@/lib/api';

export default async function KitchenReviewsPage({
  params,
}: {
  params: Promise<{ kitchenId: string }>;
}) {
  const { kitchenId } = await params;
  const store = await getStore(kitchenId);
  if (!store) notFound();

  const data = await getCookReviews(store.store.cookId);
  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;

  // The API doesn't provide a per-star breakdown yet — derive it here.
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  });

  return (
    <ReviewsClient
      kitchenId={kitchenId}
      rating={data?.averageRating ?? 0}
      reviewCount={total}
      distribution={distribution}
      reviews={reviews.map((review) => ({
        id: review.id,
        name: review.customerName,
        rating: review.rating,
        timeAgo: timeAgo(review.createdAt),
        lead: '',
        body: review.comment,
      }))}
    />
  );
}

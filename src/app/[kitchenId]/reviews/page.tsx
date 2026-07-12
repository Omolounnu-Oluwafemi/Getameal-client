import { ReviewsClient } from '@/components/features/reviews-client';

// ---------------------------------------------------------------------------
// Mock — replace with an API call (fetch kitchen reviews) when the backend is
// ready. Demo empty state: ?empty=1
// ---------------------------------------------------------------------------
export default async function KitchenReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ kitchenId: string }>;
  searchParams: Promise<{ empty?: string }>;
}) {
  const { kitchenId } = await params;
  const { empty } = await searchParams;

  if (empty) {
    return (
      <ReviewsClient
        kitchenId={kitchenId}
        rating={0}
        reviewCount={0}
        distribution={[0, 0, 0, 0, 0]}
        reviews={[]}
      />
    );
  }

  return (
    <ReviewsClient
      kitchenId={kitchenId}
      rating={4.9}
      reviewCount={62}
      distribution={[90, 12, 10, 4, 2]}
      reviews={[
        {
          id: 'r1',
          name: 'Jeffery Willson',
          rating: 5,
          timeAgo: '2 months ago',
          lead: 'I had an amazing experience at the Denton,',
          body: 'Manchester branch. The food was delicious and the delivery was right on time. Will definitely order again.',
        },
        {
          id: 'r2',
          name: 'Adaeze Okafor',
          rating: 5,
          timeAgo: '3 months ago',
          lead: 'The jollof rice was the best I have had in Lekki.',
          body: 'Generous portions and the plantain add-on was perfectly ripe. Highly recommend this kitchen.',
        },
        {
          id: 'r3',
          name: 'Tunde Bakare',
          rating: 4,
          timeAgo: '4 months ago',
          lead: 'Great taste and fast response on WhatsApp.',
          body: 'Delivery took a little longer than promised, but the food arrived hot and well packaged.',
        },
      ]}
    />
  );
}

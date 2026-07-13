import { StarIcon } from '@/components/icons';

interface KitchenStatsCarouselProps {
  totalOrders: number;
  rating?: number;
  reviewCount?: number;
}

export function KitchenStatsCarousel({
  totalOrders,
  rating,
  reviewCount,
}: KitchenStatsCarouselProps) {
  return (
    <div className="mb-4 pb-1">
      <div className="flex h-21 w-full items-center rounded-2xl border border-[#EDEDED] bg-white px-4 text-center shadow-[0px_4px_20px_0px_#0000000D]">
        <div className="flex flex-1 flex-col items-center gap-0.5">
          <span className="text-xl font-bold text-black">{totalOrders}</span>
          <span className="text-xs font-semibold text-black">Orders</span>
        </div>
        {rating !== undefined && (
          <>
            <div className="h-8 w-px shrink-0 bg-[#E1E1E1]" />
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-neutral-900">{rating}</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
            </div>
          </>
        )}
        {reviewCount !== undefined && (
          <>
            <div className="h-8 w-px shrink-0 bg-[#E1E1E1]" />
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-neutral-900">{reviewCount}</span>
              <span className="text-xs text-neutral-500">Reviews</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

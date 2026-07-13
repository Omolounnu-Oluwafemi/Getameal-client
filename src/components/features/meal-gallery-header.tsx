import Link from 'next/link';

import { CloseIcon, ShareIcon } from '@/components/icons';
import { ImageGallery } from './image-gallery';
import type { ImageSrc } from '@/types';

interface MealGalleryHeaderProps {
  images: ImageSrc[];
  alt: string;
  kitchenId: string;
}

export function MealGalleryHeader({ images, alt, kitchenId }: MealGalleryHeaderProps) {
  return (
    // Sticky: scrolls with the page until it reaches the top of the viewport,
    // then pins there while the detail cards scroll behind it (z-20 + the
    // opaque image keep them hidden underneath).
    <div className="sticky top-0 z-20">
      <ImageGallery
        images={images}
        alt={alt}
        className="relative h-83.25 w-full overflow-hidden rounded-t-[20px] bg-neutral-200 sm:h-80"
      />

      <Link
        href={`/${kitchenId}`}
        className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2.5 shadow-[0px_4px_20px_0px_#00000040]"
        aria-label="Back to kitchen"
      >
        <CloseIcon />
      </Link>

      <button
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2.5 shadow-[0px_4px_20px_0px_#00000040]"
        aria-label="Share"
      >
        <ShareIcon />
      </button>
    </div>
  );
}

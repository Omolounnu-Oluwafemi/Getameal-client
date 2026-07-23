import { ImageGallery } from './image-gallery';
import type { ImageSrc } from '@/types';

interface MealGalleryHeaderProps {
  images: ImageSrc[];
  alt: string;
}

// The close/share buttons live at the page level now, fixed to the viewport
// so they stay visible while this scrolls away with the rest of the sheet.
export function MealGalleryHeader({ images, alt }: MealGalleryHeaderProps) {
  return (
    <ImageGallery
      images={images}
      alt={alt}
      className="relative h-83.25 w-full overflow-hidden rounded-t-[20px] bg-neutral-200 sm:h-80"
    />
  );
}

'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import type { ImageSrc } from '@/types';

interface ImageGalleryProps {
  images: ImageSrc[];
  alt: string;
  className?: string;
}

export function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div
      className={
        className ??
        'relative aspect-4/3 w-full overflow-hidden bg-neutral-200 sm:aspect-video lg:aspect-16/7'
      }
    >
      {/* Swipeable track — one full-width slide per image */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scrollbar-none"
      >
        {images.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
        ))}
      </div>

      {/* Counter pill */}
      {images.length > 1 && (
        <div className="absolute right-3 bottom-3 rounded-full bg-[#282828a3] px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-[20px]">
          {current + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

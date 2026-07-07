'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import type { ImageSrc } from '@/types';

interface ImageGalleryProps {
  images: ImageSrc[];
  alt: string;
  className?: string;
}

export function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className={className ?? 'relative aspect-4/3 w-full overflow-hidden bg-neutral-200 sm:aspect-video lg:aspect-16/7'}>
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`${alt} — photo ${i + 1}`}
          fill
          className={`object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          priority={i === 0}
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      ))}

      {/* Counter pill */}
      {images.length > 1 && (
        <div className="absolute right-3 bottom-3 rounded-full bg-[#282828a3] px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-[20px]">
          {current + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

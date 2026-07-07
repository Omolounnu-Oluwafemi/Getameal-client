import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface MealCardProps {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  className?: string;
}

export function MealCard({ name, description, imageUrl, price, className }: MealCardProps) {
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-neutral-900">{name}</h3>
          <span className="shrink-0 text-sm font-semibold text-neutral-900">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{description}</p>
      </div>
    </article>
  );
}

'use client';

import Link from 'next/link';

import { CustomOrderIcon, ShareMenuIcon } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KitchenActionButtonsProps {
  kitchenId: string;
}

export function KitchenActionButtons({ kitchenId }: KitchenActionButtonsProps) {
  return (
    <div className="mb-6 flex gap-3">
      <Link
        href={`/${kitchenId}/custom-order`}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-12 flex-1 gap-2.5 rounded-[60px] p-2.5',
        )}
      >
        <CustomOrderIcon />
        Custom order
      </Link>
      <Button variant="brand" className="h-12 flex-1 gap-2.5 rounded-[60px] p-2.5">
        <ShareMenuIcon />
        Share menu
      </Button>
    </div>
  );
}

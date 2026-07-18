'use client';

import { useState } from 'react';
import Link from 'next/link';

import { CustomOrderIcon, ShareMenuIcon } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

interface KitchenActionButtonsProps {
  kitchenId: string;
  kitchenName: string;
}

export function KitchenActionButtons({ kitchenId, kitchenName }: KitchenActionButtonsProps) {
  const [copiedVisible, setCopiedVisible] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: kitchenName,
          text: `Order from ${kitchenName} on GetaMeal`,
          url,
        });
      } catch {
        // user dismissed the share sheet
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopiedVisible(true);
    }
  }

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
      <Button
        variant="brand"
        onClick={handleShare}
        className="h-12 flex-1 gap-2.5 rounded-[60px] p-2.5"
      >
        <ShareMenuIcon />
        Share menu
      </Button>

      {copiedVisible && (
        <Toast message="Link copied to clipboard" onClose={() => setCopiedVisible(false)} />
      )}
    </div>
  );
}

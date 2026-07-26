'use client';

import { useState } from 'react';

import { ShareIcon } from '@/components/icons';
import { Toast } from '@/components/ui/toast';

interface MealShareButtonProps {
  mealName: string;
  kitchenName: string;
}

export function MealShareButton({ mealName, kitchenName }: MealShareButtonProps) {
  const [copiedVisible, setCopiedVisible] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: mealName,
          text: `${mealName} from ${kitchenName} on GetaMeal`,
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
    <>
      <button
        onClick={handleShare}
        className="fixed top-28 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2.5 shadow-[0px_4px_20px_0px_#00000040]"
        aria-label="Share"
      >
        <ShareIcon />
      </button>

      {copiedVisible && (
        <Toast message="Link copied to clipboard" onClose={() => setCopiedVisible(false)} />
      )}
    </>
  );
}

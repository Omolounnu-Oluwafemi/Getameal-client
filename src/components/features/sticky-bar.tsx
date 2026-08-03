'use client';

import { Button } from '@/components/ui/button';

interface StickyBarProps {
  amount: number;
  caption: string;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
  /**
   * Replaces the default action button entirely (e.g. a quantity stepper with
   * its own independent +/- buttons, which can't nest inside a single button).
   */
  rightSlot?: React.ReactNode;
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

/**
 * Fixed bottom bar with a price summary on the left and a primary action
 * on the right. Shared between the meal detail and basket pages.
 */
export function StickyBar({
  amount,
  caption,
  actionLabel,
  onAction,
  rightSlot,
}: StickyBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex h-21.25 items-center justify-between gap-2.5 rounded-t-[20px] bg-[#FFFFFFE5] px-5 pb-[env(safe-area-inset-bottom)] shadow-[0px_4px_40px_0px_#0000001A] backdrop-blur-[20px]">
      <div>
        <p className="text-[22px] font-bold text-black">{fmt(amount)}</p>
        <p className="text-xs text-black">{caption}</p>
      </div>

      {rightSlot ?? (
        <Button
          variant="brand"
          onClick={onAction}
          className="ml-auto flex h-13 w-[60%] items-center justify-center gap-2 rounded-[50px] text-sm font-semibold active:scale-[0.98]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

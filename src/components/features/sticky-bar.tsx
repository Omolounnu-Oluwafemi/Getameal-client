'use client';

import { Button } from '@/components/ui/button';

interface StickyBarProps {
  amount: number;
  caption: string;
  actionLabel: React.ReactNode;
  onAction: () => void;
}

const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`;

/**
 * Fixed bottom bar with a price summary on the left and a primary action
 * on the right. Shared between the meal detail and basket pages.
 */
export function StickyBar({ amount, caption, actionLabel, onAction }: StickyBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex h-28 items-center justify-between gap-2.5 rounded-t-[20px] bg-[#FFFFFFE5] px-5 pt-5 pb-10 shadow-[0px_4px_40px_0px_#0000001A] backdrop-blur-[20px]">
      <div>
        <p className="text-[22px] font-bold text-black">{fmt(amount)}</p>
        <p className="text-xs text-black">{caption}</p>
      </div>

      <Button
        variant="brand"
        onClick={onAction}
        className="ml-auto flex h-13 w-[60%] items-center justify-center gap-2 rounded-[50px] text-sm font-semibold active:scale-[0.98]"
      >
        {actionLabel}
      </Button>
    </div>
  );
}

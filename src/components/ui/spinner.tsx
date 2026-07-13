import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
}

/** Circular loading indicator — grey track with a spinning brand-green arc. */
export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        // border-t-brand must come after border-neutral-200: tailwind-merge
        // treats a later all-sides border color as overriding an earlier
        // per-side one and would strip the green arc.
        'h-14 w-14 animate-spin rounded-full border-4 border-neutral-200 border-t-brand',
        className,
      )}
    />
  );
}

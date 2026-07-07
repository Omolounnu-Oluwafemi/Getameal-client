import { cn } from '@/lib/utils';
import { ClosedDotIcon, OpenDotIcon } from '@/components/icons';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'popular' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold',
        {
          'bg-neutral-800/80 text-white': variant === 'popular',
          'bg-neutral-100 text-neutral-800': variant === 'default',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  isOpen: boolean;
  className?: string;
}

export function StatusBadge({ isOpen, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-semibold', className)}>
      {isOpen ? <OpenDotIcon /> : <ClosedDotIcon />}
      <span className={isOpen ? 'text-green-600' : 'text-[#FA2A26]'}>
        {isOpen ? 'Open' : 'Closed'}
      </span>
    </span>
  );
}

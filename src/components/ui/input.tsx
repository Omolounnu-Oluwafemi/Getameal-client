import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        // text-base (16px), not text-sm: mobile browsers auto-zoom the page
        // when a focused input's font is smaller than 16px.
        'h-12.5 w-full rounded-full border border-[#E1E1E1] bg-white px-6 py-2.5 text-base text-neutral-900 outline-none placeholder:text-neutral-400 transition-colors focus:border-brand',
        className,
      )}
      {...props}
    />
  );
}

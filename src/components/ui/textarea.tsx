'use client';

import { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, onChange, ...props }: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      onChange?.(e);
    },
    [onChange],
  );

  function handleDragStart(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startHeight = textareaRef.current?.offsetHeight ?? 0;

    function onMove(e: MouseEvent | TouchEvent) {
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const delta = currentY - startY;
      if (textareaRef.current) {
        textareaRef.current.style.height = `${Math.max(87, startHeight + delta)}px`;
      }
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        rows={1}
        className={cn(
          'focus:border-brand min-h-21.75 w-full resize-none overflow-hidden rounded-[20px] border border-[#E1E1E1] bg-white px-5 py-2.5 pb-6 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400',
          className,
        )}
        onChange={handleChange}
        {...props}
      />
      <span
        className="absolute right-2 bottom-2.5 cursor-s-resize"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
          <g fill="#000" clipPath="url(#textarea-resize-clip)">
            <path d="M6 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M9 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M9 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M12 6.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M12 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
          </g>
          <defs>
            <clipPath id="textarea-resize-clip">
              <path fill="#fff" d="M0 0h18v18H0z" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </div>
  );
}

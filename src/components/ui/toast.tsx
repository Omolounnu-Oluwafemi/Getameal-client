'use client';

import { useEffect } from 'react';
import { RedIcon } from '@/components/icons';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-6 left-1/2 z-50 flex min-h-16 w-[90vw] max-w-107.25 -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 shadow-[0px_4px_20px_0px_#0000000D]">
      <RedIcon className="h-4.5 w-4.5 shrink-0" />
      {message}
    </div>
  );
}

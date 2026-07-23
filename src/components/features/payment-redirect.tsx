'use client';

import { useEffect } from 'react';

import { Spinner } from '@/components/ui/spinner';

interface PaymentRedirectProps {
  link: string;
}

/**
 * Sends the real visitor on to Paystack. Link-preview crawlers (WhatsApp,
 * iMessage, etc.) don't execute JavaScript, so they never follow this —
 * they just read this page's Open Graph tags and stop there, which is the
 * whole point: the preview shows our branding, not Paystack's.
 */
export function PaymentRedirect({ link }: PaymentRedirectProps) {
  useEffect(() => {
    window.location.replace(link);
  }, [link]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <Spinner />
      <p className="text-sm text-neutral-500">Taking you to payment…</p>
    </div>
  );
}

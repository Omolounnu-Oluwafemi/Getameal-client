'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send to your error reporting service (e.g. Sentry) here.
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold text-neutral-900">Something went wrong</h2>
      <p className="max-w-md text-neutral-500">
        An unexpected error occurred. You can try again, or come back later if the problem persists.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}

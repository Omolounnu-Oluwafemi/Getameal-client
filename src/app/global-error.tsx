'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900">Application error</h2>
        <p className="max-w-md text-neutral-500">
          A critical error occurred. Please refresh the page.
        </p>
        <pre className="max-w-md overflow-auto text-left text-xs text-neutral-400">
          {error.message}
        </pre>
      </body>
    </html>
  );
}

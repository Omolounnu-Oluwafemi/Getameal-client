import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold text-neutral-900">Page not found</h2>
      <p className="max-w-md text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <a href="https://getameal.app/" className={buttonVariants({ size: 'lg' })}>
        Go to GetaMeal
      </a>
    </main>
  );
}

import Link from 'next/link';
import { CustomOrderForm } from '@/components/features/custom-order-form';

// ---------------------------------------------------------------------------
// Mock — mirrors getKitchen in the parent kitchen page.
// Replace with an API call when the backend is ready.
// ---------------------------------------------------------------------------
function getKitchenName(kitchenId: string): string {
  void kitchenId;
  return 'Sandra Kitchen';
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function CustomOrderPage({
  params,
}: {
  params: Promise<{ kitchenId: string }>;
}) {
  const { kitchenId } = await params;
  const kitchenName = getKitchenName(kitchenId);

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="relative mx-auto max-w-lg px-4 pt-10">
        {/* Close button — floated to top-right, above the heading */}
        <Link
          href={`/${kitchenId}`}
          className="absolute top-10 right-4 flex h-9 w-9 items-center justify-center rounded-4xl border border-[#EDEDED] bg-white text-neutral-900 shadow-[0px_4px_20px_0px_#0000001A]"
          aria-label="Back to kitchen"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M12 2L2 12M2 2l10 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        {/* Header */}
        <div className="py-2">
          <h1 className="text-2xl font-bold text-neutral-900">Request special order</h1>
        </div>

        {/* Form (client component) */}
        <CustomOrderForm kitchenName={kitchenName} />
      </div>
    </div>
  );
}

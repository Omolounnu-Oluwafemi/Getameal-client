import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PaymentRedirect } from '@/components/features/payment-redirect';
import { getStore } from '@/lib/api';

// Only ever forward to Paystack's own checkout domain — without this check,
// this route would be an open redirect: anyone could craft a GetaMeal link
// (with our branding in the preview card) that actually sends visitors to
// an attacker's site.
const ALLOWED_REDIRECT_HOST = 'checkout.paystack.com';

function isSafeRedirect(link: string): boolean {
  try {
    return new URL(link).hostname === ALLOWED_REDIRECT_HOST;
  } catch {
    return false;
  }
}

interface PageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ kitchen?: string; link?: string }>;
}

/**
 * Sent in place of the raw Paystack link when the backend messages a
 * customer their payment link, so the WhatsApp/social preview shows the
 * cook's cover photo and store name instead of Paystack's own branding.
 * Real visitors are bounced straight on to Paystack; see payment-redirect.tsx.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { kitchen } = await searchParams;
  const data = kitchen ? await getStore(kitchen) : null;

  const title = data ? `Complete your order for ${data.store.storeName}` : 'Complete your payment';
  const description = 'Tap to finish paying for your order on GetaMeal.';
  const image = data?.store.coverImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function PayRedirectPage({ searchParams }: PageProps) {
  const { link } = await searchParams;
  if (!link || !isSafeRedirect(link)) notFound();

  return <PaymentRedirect link={link} />;
}

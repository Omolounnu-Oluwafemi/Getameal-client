import { env } from '@/lib/env';

/** Proxy: fetch a customer's order (phone-guarded) from the getcooks API. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const phone = new URL(request.url).searchParams.get('phone') ?? '';

  const res = await fetch(
    `${env.API_BASE_URL}/api/customers/orders/${encodeURIComponent(orderId)}?phone=${encodeURIComponent(phone)}`,
    { cache: 'no-store' },
  );

  const data = await res.json().catch(() => ({ success: false }));
  return Response.json(data, { status: res.status });
}

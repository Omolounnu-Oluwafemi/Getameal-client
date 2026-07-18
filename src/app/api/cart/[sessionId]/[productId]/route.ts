import { env } from '@/lib/env';

/** Proxy: remove one product from a session's cart. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string; productId: string }> },
) {
  const { sessionId, productId } = await params;

  const res = await fetch(
    `${env.API_BASE_URL}/api/cart/${encodeURIComponent(sessionId)}/${encodeURIComponent(productId)}`,
    { method: 'DELETE' },
  );

  const data = await res.json().catch(() => ({ success: false }));
  return Response.json(data, { status: res.status });
}

import { env } from '@/lib/env';

/** Proxy: fetch a session's cart from the getcooks API. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  const res = await fetch(`${env.API_BASE_URL}/api/cart/${encodeURIComponent(sessionId)}`, {
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({ success: false }));
  return Response.json(data, { status: res.status });
}

/** Proxy: clear a session's cart. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  const res = await fetch(`${env.API_BASE_URL}/api/cart/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  });

  const data = await res.json().catch(() => ({ success: false }));
  return Response.json(data, { status: res.status });
}

import { env } from '@/lib/env';

/**
 * Proxy to the getcooks cart API. Keeps API_BASE_URL server-side and avoids
 * cross-origin requests from the browser.
 */
export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${env.API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({ success: false }));
  return Response.json(data, { status: res.status });
}

import { revalidatePath } from 'next/cache';

import { env } from '@/lib/env';

/**
 * Proxy to the getcooks create-review endpoint. `storeHandle` is used only to
 * revalidate the reviews page cache so the new review shows immediately.
 */
export async function POST(request: Request) {
  const { storeHandle, ...payload } = await request.json();

  const res = await fetch(`${env.API_BASE_URL}/api/reviews/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({ success: false }));

  if (res.ok && data.success && typeof storeHandle === 'string' && storeHandle) {
    revalidatePath(`/${storeHandle}/reviews`);
  }

  return Response.json(data, { status: res.status });
}

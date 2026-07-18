// Client-side cart helpers — talk to the getcooks cart API through the
// /api/cart proxy route.

export interface CartAddOn {
  name: string;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  customerPrice: number;
  quantity: number;
  addOns: (CartAddOn & { _id?: string })[];
  image: string;
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

interface CartResponse {
  success: boolean;
  message?: string;
  cart?: Cart;
}

const SESSION_KEY = 'getameal_session_id';

/** Anonymous cart session — generated once and persisted in localStorage. */
export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session_${crypto.randomUUID()}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Fetch the current session's cart. Returns null on failure. */
export async function getCart(): Promise<Cart | null> {
  try {
    const res = await fetch(`/api/cart/${encodeURIComponent(getSessionId())}`);
    if (!res.ok) return null;

    const data = (await res.json()) as CartResponse;
    return data.success && data.cart ? data.cart : null;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return null;
  }
}

/** Remove one product from the cart. Returns the updated cart, or null on failure. */
export async function removeFromCart(productId: string): Promise<Cart | null> {
  try {
    const res = await fetch(
      `/api/cart/${encodeURIComponent(getSessionId())}/${encodeURIComponent(productId)}`,
      { method: 'DELETE' },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as CartResponse;
    return data.success && data.cart ? data.cart : null;
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    return null;
  }
}

/** Clear the whole cart (e.g. after a successful payment). */
export async function clearCart(): Promise<Cart | null> {
  try {
    const res = await fetch(`/api/cart/${encodeURIComponent(getSessionId())}`, {
      method: 'DELETE',
    });
    if (!res.ok) return null;

    const data = (await res.json()) as CartResponse;
    return data.success && data.cart ? data.cart : null;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return null;
  }
}

/** Add a product to the cart. Returns the updated cart, or null on failure. */
export async function addToCart(input: {
  productId: string;
  quantity: number;
  addOns: CartAddOn[];
}): Promise<Cart | null> {
  const payload = { sessionId: getSessionId(), ...input };
  console.log('Add to cart payload:', JSON.stringify(payload, null, 2));

  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Add to cart failed:', res.status, await res.text().catch(() => ''));
      return null;
    }

    const data = (await res.json()) as CartResponse;
    return data.success && data.cart ? data.cart : null;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return null;
  }
}

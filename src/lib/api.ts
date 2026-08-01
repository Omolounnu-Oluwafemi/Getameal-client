import { env } from './env';
import type { OrderDetails } from './orders';

// ---------------------------------------------------------------------------
// API response types — mirror the getcooks backend payloads.
// ---------------------------------------------------------------------------
export interface ApiAddOn {
  name: string;
  price: number;
  _id: string;
}

export interface ApiProductImage {
  url: string;
  publicId: string;
  _id: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  whatsIncluded: string;
  unitType: string;
  price: number;
  customerPrice: number;
  addOns: ApiAddOn[];
  images: ApiProductImage[];
  isAvailable: boolean;
  isAlwaysAvailable: boolean;
}

export interface ApiStore {
  id: string;
  cookId: string;
  storeName: string;
  storeHandle: string;
  storeLink: string;
  storeDescription: string;
  profileImage: string;
  coverImage: string;
  phone: string;
  email: string;
  state: string;
  kitchenAddress: string;
  pickupLandmark: string;
  pickupWindow: { from: string; to: string };
  deliveryEnabled: boolean;
  deliveryFee: number;
  preparationDays: number;
  rating: number;
  reviewsCount: number;
  ordersCount: number;
  isAvailable: boolean;
  isApproved: boolean;
}

export interface StoreResponse {
  success: boolean;
  store: ApiStore;
  products: ApiProduct[];
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

/**
 * Fetch a store (kitchen) with its products by handle.
 * Returns null when the store doesn't exist or the API is unreachable,
 * so callers can decide between notFound() and an error state.
 */
export async function getStore(handle: string): Promise<StoreResponse | null> {
  try {
    const res = await fetch(
      `${env.API_BASE_URL}/api/customers/store/${encodeURIComponent(handle)}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as StoreResponse;
    console.log('Fetched store data:', JSON.stringify(data, null, 2));
    return data.success ? data : null;
  } catch (error) {
    console.error(`Failed to fetch store "${handle}":`, error);
    return null;
  }
}

/**
 * Fetch a single product from a store's catalog. There is no dedicated
 * product endpoint yet, so this picks it out of the (cached) store response.
 */
export async function getProduct(
  handle: string,
  productId: string,
): Promise<{ store: ApiStore; product: ApiProduct } | null> {
  const data = await getStore(handle);
  const product = data?.products.find((p) => p.id === productId);
  return data && product ? { store: data.store, product } : null;
}

export interface VerifiedOrder {
  id: string;
  status: string;
  paymentStatus: string;
  // Present on first verification, omitted on the "Already processed" repeat.
  customerName?: string;
  totalAmount?: number;
}

/**
 * Verify a Paystack payment after the customer is redirected back with
 * ?trxref=...&reference=... — the backend confirms with Paystack and marks
 * the order paid. Returns the verified order, or null when verification fails.
 */
export async function verifyPayment(
  reference: string,
  trxref?: string,
): Promise<VerifiedOrder | null> {
  try {
    const params = new URLSearchParams({ reference, trxref: trxref ?? reference });
    const res = await fetch(`${env.API_BASE_URL}/api/orders/payment/callback?${params}`, {
      method: 'POST',
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { order?: VerifiedOrder };
    return data.order ?? null;
  } catch (error) {
    console.error(`Failed to verify payment "${reference}":`, error);
    return null;
  }
}

/**
 * Server-side order lookup (phone-guarded) — used by the receipt page, where
 * the phone arrives as a query param on the shared link.
 */
export async function getOrder(orderId: string, phone: string): Promise<OrderDetails | null> {
  try {
    const res = await fetch(
      `${env.API_BASE_URL}/api/customers/orders/${encodeURIComponent(orderId)}?phone=${encodeURIComponent(phone)}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { success: boolean; order?: OrderDetails };
    return data.success && data.order ? data.order : null;
  } catch (error) {
    console.error(`Failed to fetch order "${orderId}":`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export interface ApiReview {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
}

export interface CookReviews {
  success: boolean;
  averageRating: number;
  total: number;
  reviews: ApiReview[];
}

/** Fetch a cook's reviews. Returns null when the API is unreachable. */
export async function getCookReviews(cookId: string): Promise<CookReviews | null> {
  try {
    const res = await fetch(`${env.API_BASE_URL}/api/reviews/cook/${encodeURIComponent(cookId)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as CookReviews;
    return data.success ? data : null;
  } catch (error) {
    console.error(`Failed to fetch reviews for cook "${cookId}":`, error);
    return null;
  }
}

/** "2026-07-17T…" → "2 days ago" style label. */
export function timeAgo(dateString: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(dateString).getTime()) / 1000);
  const units: [label: string, seconds: number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [label, size] of units) {
    const value = Math.floor(seconds / size);
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

/** "per_plate" → "Plate", "per_litre" → "Litre", etc. */
export function unitLabel(unitType: string): string {
  const word = unitType.replace(/^per_/, '').replace(/_/g, ' ');
  return word.charAt(0).toUpperCase() + word.slice(1);
}

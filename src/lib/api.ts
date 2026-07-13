import { env } from './env';

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

/** "per_plate" → "Plate", "per_litre" → "Litre", etc. */
export function unitLabel(unitType: string): string {
  const word = unitType.replace(/^per_/, '').replace(/_/g, ' ');
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Client-side order helpers — talk to the getcooks orders API through the
// /api/orders proxy route.

import { getSessionId } from './cart';

/**
 * Place an order from the session's cart — the backend reads the items,
 * store, and delivery fee from the cart itself.
 */
export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNote?: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  readyDate: string;
}

export interface CreatedOrderItem {
  name: string;
  quantity: number;
  price: number;
  addOns: { name: string; price: number; _id: string }[];
  subtotal: number;
}

export interface CreatedOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  deliveryAddress: string | null;
  readyDate: string;
  subtotal: number;
  serviceFee: number;
  paystackFee?: number;
  deliveryFee: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentLink: string;
  items: CreatedOrderItem[];
}

interface CreateOrderResponse {
  success: boolean;
  message?: string;
  order?: CreatedOrder;
}

/**
 * A custom order ("food request") — sent to the cook to confirm availability
 * and price on WhatsApp; no payment link until the cook responds.
 */
export interface FoodRequestInput {
  cookId: string;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  readyDate: string;
  foodRequest: string;
}

export interface FoodRequestOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  foodRequest: string;
  deliveryType: string;
  deliveryAddress: string | null;
  readyDate: string;
  status: string;
  paymentStatus: string;
}

export type CreateFoodRequestResult = { order: FoodRequestOrder } | { error: string };

/**
 * Send a custom order request to the cook. On failure, `error` carries the
 * backend's actual message (falling back to a generic one only if the
 * response has none), so the real reason is visible instead of a guess.
 */
export async function createFoodRequest(
  input: FoodRequestInput,
): Promise<CreateFoodRequestResult> {
  console.log('Food request payload:', JSON.stringify(input, null, 2));

  const fallback = 'Couldn’t send your request. Please try again.';

  try {
    const res = await fetch('/api/custom-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const data = (await res.json().catch(() => null)) as
      | { success: boolean; message?: string; order?: FoodRequestOrder }
      | null;

    if (res.ok && data?.success && data.order) {
      return { order: data.order };
    }

    console.error('Food request failed:', res.status, data);
    return { error: data?.message || fallback };
  } catch (error) {
    console.error('Failed to send food request:', error);
    return { error: 'Couldn’t reach the server. Please check your connection and try again.' };
  }
}

/**
 * The backend has returned `profileImage` both as a plain Cloudinary URL
 * string and as `{ url, publicId }` — accept either shape.
 */
export type RemoteImage = string | { url: string; publicId?: string } | null | undefined;

/** Safely pulls the URL out of either shape `RemoteImage` can take. */
export function imageUrl(image: RemoteImage): string | undefined {
  if (!image) return undefined;
  return typeof image === 'string' ? image : image.url;
}

// Shape of GET /api/customers/orders/:id?phone=...
export interface OrderDetails {
  id: string;
  customer?: {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    note?: string | null;
  };
  items: {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    addOns: { name: string; price: number }[];
    subtotal: number;
    productImage: string | null;
  }[];
  /** Present instead of `items` for custom ("food request") orders. */
  customOrderTitle?: string | null;
  customOrderDescription?: string | null;
  subtotal?: number;
  serviceFee?: number;
  paystackFee?: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentReference?: string;
  /** Our own /pay/[orderId] wrapper URL — auto-redirects, shows branded preview when shared. */
  paymentLink?: string;
  /** The direct Paystack checkout URL — use this for an in-app "Pay" button. */
  rawPaymentLink?: string;
  isPaid?: boolean;
  statusHistory?: { current: string; previous: string | null };
  receiptUrl?: string;
  feesAddedToCustomer?: boolean;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string | null;
  readyDate: string;
  readyTime: string;
  pickupWindow: { from: string; to: string };
  deliveryFee: number;
  createdAt: string;
  customerNote?: string;
  sellerNote?: string | null;
  cook: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    storeName: string;
    storeHandle: string;
    storeLink: string;
    profileImage: RemoteImage;
    kitchenAddress: string;
    pickupLandmark: string;
    pickupWindow: { from: string; to: string };
    pickupEnabled?: boolean;
    deliveryEnabled?: boolean;
    rating?: number;
    reviewsCount?: number;
    isApproved?: boolean;
    isAvailable?: boolean;
  };
}

interface OrderDetailsResponse {
  success: boolean;
  order?: OrderDetails;
}

/**
 * Fetch an order's details from the browser (phone comes from the checkout
 * session). Returns null when not found or the phone doesn't match.
 */
export async function getOrderDetails(orderId: string, phone: string): Promise<OrderDetails | null> {
  try {
    const res = await fetch(
      `/api/orders/${encodeURIComponent(orderId)}?phone=${encodeURIComponent(phone)}`,
    );
    if (!res.ok) return null;

    const data = (await res.json()) as OrderDetailsResponse;
    return data.success && data.order ? data.order : null;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    return null;
  }
}

/**
 * Place an order from the session's cart. Returns the created order (with
 * Paystack payment link), or null on failure.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder | null> {
  const payload = { sessionId: getSessionId(), ...input };
  console.log('Create order payload:', JSON.stringify(payload, null, 2));

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Create order failed:', res.status, await res.text().catch(() => ''));
      return null;
    }

    const data = (await res.json()) as CreateOrderResponse;
    return data.success && data.order ? data.order : null;
  } catch (error) {
    console.error('Failed to create order:', error);
    return null;
  }
}

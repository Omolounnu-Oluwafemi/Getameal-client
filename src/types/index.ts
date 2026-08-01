import type { StaticImageData } from 'next/image';

export type ImageSrc = string | StaticImageData;

export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface MealDetail {
  id: string;
  name: string;
  images: ImageSrc[];
  price: number;
  unit: string;
  description: string;
  extras: Extra[];
  totalOrders: number;
  listedDate: string;
  delivery: { available: boolean; price: number };
  pickup: { available: boolean };
  kitchenId: string;
}

export interface KitchenMealItem {
  id: string;
  name: string;
  imageUrl: ImageSrc;
  price: number;
  unit: string;
  soldCount: number;
  isAvailable: boolean;
}

export interface KitchenStats {
  totalOrders: number;
  rating?: number;
  reviewCount?: number;
}

export interface Kitchen {
  id: string;
  name: string;
  bannerImage: ImageSrc;
  avatarImage: ImageSrc;
  location: string;
  isOpen: boolean;
  pickup: { available: boolean };
  delivery: { available: boolean; price: number };
  stats: KitchenStats;
  meals: KitchenMealItem[];
}

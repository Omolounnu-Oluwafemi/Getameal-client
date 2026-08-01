'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  CloseIcon,
  DeliveryIcon,
  DotIcon,
  NewCustomOrderIcon,
  NewShareIcon,
  PickupIcon,
  SearchIcon,
  ShareMenuIcon,
  StarIcon,
} from '@/components/icons';
import { StatusBadge } from '@/components/ui/badge';
import { Toast } from '@/components/ui/toast';
import { KitchenMealGrid } from './kitchen-meal-grid';
import type { Kitchen } from '@/types';

interface KitchenPageClientProps {
  kitchen: Kitchen;
  kitchenId: string;
}

const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export function KitchenPageClient({ kitchen, kitchenId }: KitchenPageClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedVisible, setCopiedVisible] = useState(false);
  const { stats } = kitchen;

  // The category row sticks right below the header — measure the header's
  // real rendered height (it changes when the search field opens) instead of
  // guessing a fixed value, since safe-area insets vary by device.
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(72);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: kitchen.name,
          text: `Order from ${kitchen.name} on GetaMeal`,
          url,
        });
      } catch {
        // user dismissed the share sheet
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopiedVisible(true);
    }
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header — stays pinned while the banner and meal grid scroll underneath. */}
      <div
        ref={headerRef}
        className="sticky top-0 z-30 mx-auto flex max-w-3xl items-center gap-3 bg-white px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-3 lg:max-w-5xl"
      >
        {searchOpen ? (
          <div className="flex flex-1 items-center gap-2 rounded-full border border-[#EDEDED] bg-white px-4 py-2.5">
            <SearchIcon className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full text-base text-black outline-none placeholder:text-neutral-400"
            />
            <button
              onClick={closeSearch}
              aria-label="Close search"
              className="shrink-0 text-neutral-500"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-neutral-200">
              <Image
                src={kitchen.avatarImage}
                alt={kitchen.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold text-black">{kitchen.name}</h1>
              <div className="mt-0.5 flex items-center gap-2.5 text-sm text-[#5C5C5C]">
                <span className="truncate">{kitchen.location}</span>
                <StatusBadge isOpen={kitchen.isOpen} />
              </div>
            </div>
            <button
              onClick={handleShare}
              aria-label="Share"
              className="flex h-6 w-6 shrink-0 items-center justify-center text-black"
            >
              <NewShareIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search dishes"
              className="flex h-6 w-6 shrink-0 items-center justify-center text-black"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Banner */}
      <div className="relative h-60.5 w-full overflow-hidden bg-neutral-200 sm:h-64 lg:h-72">
        <Image
          src={kitchen.bannerImage}
          alt={`${kitchen.name} banner`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-4 flex flex-col gap-3 px-4 text-white">
          <div className="flex items-center gap-2 text-base font-semibold">
            <span>{stats.totalOrders} Orders</span>
            {stats.rating !== undefined && (
              <>
                <span aria-hidden="true" className="text-2xl leading-none">
                  <DotIcon className="brightness-0 invert" />
                </span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-3.5 w-3.5" />
                  ))}
                </span>
                <span>
                  {stats.rating}
                  {stats.reviewCount !== undefined && ` (${stats.reviewCount})`}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-sm">
              <PickupIcon className="h-4 w-4 brightness-0 invert" />
              Pick-up
            </span>
            <DotIcon className="brightness-0 invert" />
            <span className="text-sm">
              {kitchen.pickup.available ? 'Available' : 'Unavailable'}
            </span>
            {kitchen.delivery.available && (
              <>
                <DotIcon className="brightness-0 invert" />
                <span className="flex items-center gap-1.5 text-sm">
                  <DeliveryIcon className="h-4 w-4 brightness-0 invert" />
                  Delivery
                </span>
                <DotIcon className="brightness-0 invert" />
                <span className="text-sm font-semibold">{fmt(kitchen.delivery.price)}</span>
              </>
            )}
          </div>

          {/* Custom-order + share — frosted glass over the image, right below the info above. */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${kitchenId}/custom-order`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/22 px-5 py-3.5 text-center text-base font-semibold text-white"
            >
              <NewCustomOrderIcon className="h-5 w-5" />
              Custom order
            </Link>
            <button
              onClick={handleShare}
              aria-label="Share kitchen"
              className="flex h-12 w-17.25 shrink-0 items-center justify-center gap-2.5 rounded-[60px] bg-white/22 p-2.5"
            >
              <ShareMenuIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6 pb-10 lg:max-w-5xl">
        <KitchenMealGrid
          meals={kitchen.meals}
          isKitchenOpen={kitchen.isOpen}
          kitchenId={kitchenId}
          searchQuery={searchQuery}
          stickyOffset={headerHeight}
        />
      </div>

      {copiedVisible && (
        <Toast message="Link copied to clipboard" onClose={() => setCopiedVisible(false)} />
      )}
    </div>
  );
}

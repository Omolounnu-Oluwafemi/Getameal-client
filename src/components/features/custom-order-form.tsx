'use client';

import { useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAY_HEADERS = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function ordinal(n: number): string {
  const v = n % 100;
  const suffix = ['th', 'st', 'nd', 'rd'][(v - 20) % 10] ?? ['th', 'st', 'nd', 'rd'][v] ?? 'th';
  return `${n}${suffix}`;
}

function formatDate(d: Date) {
  return `${DAY_FULL[d.getDay()]} ${ordinal(d.getDate())} ${MONTH_NAMES[d.getMonth()]}`;
}

// ---------------------------------------------------------------------------
// Date picker (bottom sheet layer)
// ---------------------------------------------------------------------------
interface DatePickerProps {
  value: Date | null;
  onChange: (d: Date) => void;
  onClose: () => void;
}

function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function isPast(day: number) {
    return new Date(viewYear, viewMonth, day) < today;
  }

  function isSelected(day: number) {
    return (
      value?.getDate() === day &&
      value?.getMonth() === viewMonth &&
      value?.getFullYear() === viewYear
    );
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2"
      onClick={onClose}
    >
      <div
        className="w-full rounded-[20px] border border-[#EDEDED] bg-white px-5 pt-5 pb-4 shadow-[0px_4px_20px_0px_#0000000D]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-black">Pick a date</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M12 2L2 12M2 2l10 10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4 h-px bg-neutral-100" />

        {/* Day headers */}
        <div className="mb-6 grid grid-cols-7 text-center">
          {DAY_HEADERS.map((d) => (
            <span key={d} className="text-[12px] font-semibold text-black">
              {d}
            </span>
          ))}
        </div>

        {/* Month / year + nav */}
        <div className="mb-4 flex items-center justify-between">
          <span className="ml-3 text-sm font-bold text-black">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            >
              ›
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {cells.map((day, i) =>
            day === null ? (
              <span key={`e-${i}`} />
            ) : (
              <button
                key={day}
                disabled={isPast(day)}
                onClick={() => {
                  onChange(new Date(viewYear, viewMonth, day));
                  onClose();
                }}
                className={
                  isSelected(day)
                    ? 'bg-brand mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white'
                    : isPast(day)
                      ? 'py-2 text-sm text-[#C3C3C3]'
                      : 'hover:text-brand py-2 text-sm text-black hover:font-semibold'
                }
              >
                {day}
              </button>
            ),
          )}
        </div>

        {value && (
          <div className="mt-5 border-t border-neutral-100 pt-4 text-center text-sm font-semibold text-black">
            {formatDate(value)}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------
const LABEL = 'mb-2 block font-inter text-sm font-normal leading-5 text-black';

type DeliveryOption = 'pickup' | 'delivery' | null;

interface CustomOrderFormProps {
  kitchenName: string;
  deliveryEnabled: boolean;
  deliveryFee: number;
}

const fmtNaira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export function CustomOrderForm({
  kitchenName,
  deliveryEnabled,
  deliveryFee,
}: CustomOrderFormProps) {
  const router = useRouter();
  const { kitchenId } = useParams<{ kitchenId: string }>();
  // isPending stays true until the checkout preview page's own data (a live
  // backend fetch) is ready — without this the button gives no feedback
  // while that navigation is in flight.
  const [isNavigating, startNavigating] = useTransition();
  const [order, setOrder] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryOption>(null);
  const [address, setAddress] = useState('');
  const [deliveryDropdownOpen, setDeliveryDropdownOpen] = useState(false);

  const canSubmit =
    order.trim().length > 0 &&
    name.trim().length > 0 &&
    phone.replace(/\D/g, '').length >= 10 &&
    date !== null &&
    deliveryType !== null &&
    (deliveryType !== 'delivery' || address.trim().length > 0);

  const deliveryLabel =
    deliveryType === 'pickup'
      ? 'Pickup - Free'
      : deliveryType === 'delivery'
        ? `Delivery - ${fmtNaira(deliveryFee)}`
        : 'Select option';

  function handleSubmit() {
    if (!canSubmit || !date || !deliveryType) return;

    // Midday keeps the chosen day stable across timezones.
    const ready = new Date(date);
    ready.setHours(12, 0, 0, 0);

    // Read by the preview page, which submits the request on confirmation.
    sessionStorage.setItem(
      'custom_order_request',
      JSON.stringify({
        foodRequest: order.trim(),
        notes: notes.trim(),
        name: name.trim(),
        phone: phone.replace(/\D/g, '').replace(/^0+/, ''),
        readyDate: ready.toISOString(),
        deliveryType,
        address: deliveryType === 'delivery' ? address.trim() : '',
      }),
    );
    startNavigating(() => {
      router.push(`/${kitchenId}/custom-order/checkout`);
    });
  }

  return (
    <>
      <p className="mb-6 text-sm leading-relaxed text-[#797979]">
        Tell {kitchenName}{' '}
        what you&apos;d like. They&apos;ll confirm availability, price, and pickup/delivery
        details on WhatsApp.
      </p>

      <div className="space-y-4">
        <div>
          <label className={LABEL}>What would you like?</label>
          <Input
            type="text"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Example: 5 litres Egusi Soup"
          />
        </div>

        <div>
          <label className={LABEL}>Special notes?</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: Egusi soup with beef, stockfish, and assorted meat."
          />
        </div>

        <div>
          <label className={LABEL}>WhatsApp number</label>
          <div className="focus-within:border-brand flex h-13.75 overflow-hidden rounded-full border border-[#E1E1E1] bg-white transition-colors">
            <div className="flex shrink-0 items-center border-r border-[#E1E1E1] bg-[#F7F7F7] px-5 text-base font-semibold text-neutral-700">
              +234
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              // text-base (16px), not text-sm: mobile browsers auto-zoom the
              // page when a focused input's font is smaller than 16px.
              className="min-w-0 flex-1 bg-transparent px-5 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>
          <p className="mt-1.5 text-xs text-[#989898]">
            We&apos;ll send your order updates on WhatsApp.
          </p>
        </div>

        <div>
          <label className={LABEL}>Your name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className={LABEL}>When do you need it?</label>
          <button
            onClick={() => setDatePickerOpen(true)}
            className="hover:border-brand flex h-13.75 w-full items-center justify-between rounded-full border border-[#E1E1E1] bg-white py-2.5 pr-4 pl-6 text-sm transition-colors"
          >
            <span className={date ? 'text-neutral-900' : 'text-neutral-400'}>
              {date ? formatDate(date) : 'Pick a date'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="14"
              fill="none"
              viewBox="0 0 9 14"
            >
              <path
                fill="#000"
                d="m7.72 8.472-3.217 3.225-3.217-3.225A.753.753 0 1 0 .22 9.537l3.75 3.75a.75.75 0 0 0 1.065 0l3.75-3.75A.753.753 0 1 0 7.72 8.472M1.287 5.037l3.217-3.225 3.218 3.225a.75.75 0 0 0 1.229-.244.75.75 0 0 0-.164-.821L5.036.222a.75.75 0 0 0-1.065 0L.22 3.972a.753.753 0 1 0 1.065 1.065"
              />
            </svg>
          </button>
        </div>

        {/* Delivery method */}
        <div>
          <label className={LABEL}>How will you get your order?</label>
          <div className="relative">
            <button
              onClick={() => setDeliveryDropdownOpen((o) => !o)}
              className="hover:border-brand flex h-13.75 w-full items-center justify-between rounded-full border border-[#E1E1E1] bg-white py-2.5 pr-4 pl-6 text-sm transition-colors"
            >
              <span className={deliveryType ? 'text-neutral-900' : 'text-neutral-400'}>
                {deliveryLabel}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6l4-4 4 4M4 10l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {deliveryDropdownOpen && (
              <div className="absolute inset-x-0 bottom-full z-20 mb-2 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-[0px_4px_20px_0px_#0000001A]">
                <button
                  onClick={() => {
                    setDeliveryType('pickup');
                    setDeliveryDropdownOpen(false);
                  }}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-neutral-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-black">Pickup - Free</p>
                    <p className="text-xs text-neutral-500">
                      Collect from the seller&rsquo;s pickup location.
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12l4-4-4-4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {deliveryEnabled && (
                  <>
                    <div className="mx-4 h-px bg-[#EDEDED]" />
                    <button
                      onClick={() => {
                        setDeliveryType('delivery');
                        setDeliveryDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-neutral-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-black">
                          Delivery - {fmtNaira(deliveryFee)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Get it delivered to your address.
                        </p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 12l4-4-4-4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delivery address */}
        {deliveryType === 'delivery' && (
          <div>
            <label className={LABEL}>Delivery address</label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </div>
        )}
      </div>

      {datePickerOpen && (
        <DatePicker value={date} onChange={setDate} onClose={() => setDatePickerOpen(false)} />
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg">
          <Button
            variant="brand"
            onClick={handleSubmit}
            disabled={!canSubmit || isNavigating}
            className="h-14 w-full rounded-full text-base font-semibold disabled:opacity-50"
          >
            {isNavigating ? (
              <Spinner className="h-5 w-5 border-2 border-white/30 border-t-white" />
            ) : (
              'Send request'
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

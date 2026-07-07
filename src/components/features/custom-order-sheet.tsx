'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_HEADERS = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function ordinal(n: number) {
  const v = n % 100;
  const s = n + (['th', 'st', 'nd', 'rd'][(v - 20) % 10] ?? ['th', 'st', 'nd', 'rd'][v] ?? 'th');
  return s;
}

function formatDate(d: Date) {
  return `${DAY_FULL[d.getDay()]} ${ordinal(d.getDate())} ${MONTH_NAMES[d.getMonth()]}`;
}

// ---------------------------------------------------------------------------
// Date picker
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
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <div className="fixed inset-0 z-60 flex items-end" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="mb-4 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-neutral-200" />
        </div>

        {/* Heading */}
        <h3 className="mb-4 text-xl font-bold text-neutral-900">Pick a date</h3>
        <div className="mb-3 h-px bg-neutral-100" />

        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 text-center">
          {DAY_HEADERS.map((d) => (
            <span key={d} className="text-[11px] font-semibold text-neutral-400">{d}</span>
          ))}
        </div>

        {/* Month / year + nav */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-neutral-900">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
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
                    ? 'mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white'
                    : isPast(day)
                    ? 'py-2 text-sm text-neutral-300'
                    : 'py-2 text-sm text-neutral-900 hover:font-semibold hover:text-brand'
                }
              >
                {day}
              </button>
            ),
          )}
        </div>

        {/* Footer */}
        {value && (
          <div className="mt-4 border-t border-neutral-100 pt-4 text-center text-sm font-semibold text-neutral-800">
            {formatDate(value)}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom order sheet
// ---------------------------------------------------------------------------
const INPUT = 'w-full rounded-2xl border border-[#EDEDED] bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-brand transition-colors';
const LABEL = 'mb-2 block text-sm font-semibold text-neutral-900';

interface CustomOrderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  kitchenName: string;
}

export function CustomOrderSheet({ isOpen, onClose, kitchenName }: CustomOrderSheetProps) {
  const [order, setOrder] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92svh] flex-col rounded-t-3xl bg-white">
        {/* Drag handle */}
        <div className="flex shrink-0 justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-neutral-200" />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Header */}
          <div className="mb-2 flex items-start justify-between pt-4">
            <h2 className="text-xl font-bold text-neutral-900">Request special order</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 2L2 12M2 2l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-neutral-500">
            Tell {kitchenName} what you&apos;d like. They&apos;ll confirm availability, price, and
            pickup/delivery details on WhatsApp.
          </p>

          <div className="space-y-4">
            {/* What would you like */}
            <div>
              <label className={LABEL}>What would you like?</label>
              <input
                type="text"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="Example: 5 litres Egusi Soup"
                className={INPUT}
              />
            </div>

            {/* Special notes */}
            <div>
              <label className={LABEL}>Special notes?</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: Egusi soup with beef, stockfish, and assorted meat."
                rows={3}
                className={`${INPUT} resize-none`}
              />
            </div>

            {/* WhatsApp number */}
            <div>
              <label className={LABEL}>WhatsApp number</label>
              <div className="flex overflow-hidden rounded-2xl border border-[#EDEDED] bg-white focus-within:border-brand transition-colors">
                <div className="flex shrink-0 items-center bg-neutral-100 px-4 py-3.5 text-sm font-semibold text-neutral-700">
                  +123
                </div>
                <div className="w-px shrink-0 bg-[#EDEDED]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
                />
              </div>
              <p className="mt-1.5 text-xs text-neutral-400">
                We&apos;ll send your order updates on WhatsApp.
              </p>
            </div>

            {/* Your name */}
            <div>
              <label className={LABEL}>Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={INPUT}
              />
            </div>

            {/* When do you need it */}
            <div>
              <label className={LABEL}>When do you need it?</label>
              <button
                onClick={() => setDatePickerOpen(true)}
                className="flex w-full items-center justify-between rounded-2xl border border-[#EDEDED] bg-white px-4 py-3.5 text-sm transition-colors hover:border-brand"
              >
                <span className={date ? 'text-neutral-900' : 'text-neutral-400'}>
                  {date ? formatDate(date) : 'Pick a date'}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="shrink-0 border-t border-neutral-100 px-4 py-4">
          <Button variant="brand" className="h-14 w-full rounded-full text-base font-semibold">
            Send request
          </Button>
        </div>
      </div>

      {/* Date picker layer */}
      {datePickerOpen && (
        <DatePicker
          value={date}
          onChange={setDate}
          onClose={() => setDatePickerOpen(false)}
        />
      )}
    </>
  );
}

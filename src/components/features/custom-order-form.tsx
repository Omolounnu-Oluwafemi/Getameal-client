'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface CustomOrderFormProps {
  kitchenName: string;
}

export function CustomOrderForm({ kitchenName }: CustomOrderFormProps) {
  const [order, setOrder] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <>
      <p className="mb-6 text-sm leading-relaxed text-[#797979]">
        Tell {kitchenName} what you&apos;d like. They&apos;ll confirm availability, price, and
        pickup/delivery details on WhatsApp.
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
            <div className="flex shrink-0 items-center border-r border-[#E1E1E1] bg-[#F7F7F7] px-5 text-sm font-semibold text-neutral-700">
              +234
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="min-w-0 flex-1 bg-transparent px-5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
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
      </div>

      {datePickerOpen && (
        <DatePicker value={date} onChange={setDate} onClose={() => setDatePickerOpen(false)} />
      )}

      <div className="mt-20">
        <Button variant="brand" className="h-14 w-full rounded-full text-base font-semibold">
          Send request
        </Button>
      </div>
    </>
  );
}

export type ServiceOption = { label: string; minutes: number; price: string };
export type Service = { name: string; options: ServiceOption[] };

export const SERVICES: Service[] = [
  {
    name: "Klasická masáž",
    options: [
      { label: "30 min", minutes: 30, price: "34 €" },
      { label: "60 min", minutes: 60, price: "52 €" },
      { label: "90 min", minutes: 90, price: "63 €" },
    ],
  },
  {
    name: "Športová masáž",
    options: [
      { label: "30 min", minutes: 30, price: "34 €" },
      { label: "60 min", minutes: 60, price: "52 €" },
      { label: "90 min", minutes: 90, price: "63 €" },
    ],
  },
  { name: "Bankovanie & moxovanie", options: [{ label: "30 min", minutes: 30, price: "32 €" }] },
  { name: "Myofasciálna masáž", options: [{ label: "60 min", minutes: 60, price: "46 €" }] },
  { name: "Lymfoconturing", options: [{ label: "90 min", minutes: 90, price: "110 €" }] },
  { name: "Champi – indická masáž hlavy", options: [{ label: "25 min", minutes: 25, price: "30 €" }] },
  { name: "Kobido antiaging masáž", options: [{ label: "25 min", minutes: 25, price: "30 €" }] },
  { name: "Masáž lávovými kameňmi", options: [{ label: "90 min", minutes: 90, price: "46 €" }] },
];

/** Otváracie hodiny: index 0 = nedeľa … 6 = sobota. null = zatvorené. */
export const BUSINESS_HOURS: ({ open: number; close: number } | null)[] = [
  null,
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 9, close: 20 },
  { open: 10, close: 16 },
];

export const SLOT_STEP_MIN = 30;
/** Rezerva na presun medzi klientmi. */
export const BUFFER_MIN = 30;
/** Koľko dní dopredu je možné rezervovať. */
export const BOOKING_HORIZON_DAYS = 45;

export type Busy = { starts_at: string; ends_at: string };

export const SK_DAYS = ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"];
export const SK_MONTHS = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];

export function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatTime(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatDateLong(d: Date) {
  return `${SK_DAYS[d.getDay()]} ${d.getDate()}. ${(SK_MONTHS[d.getMonth()] ?? "").toLowerCase()} ${d.getFullYear()}`;
}

export type Slot = { start: Date; end: Date; available: boolean };

/** Vygeneruje všetky sloty pre daný deň a označí obsadené. */
export function buildDaySlots(date: Date, durationMin: number, busy: Busy[], now: Date): Slot[] {
  const hours = BUSINESS_HOURS[date.getDay()];
  if (!hours) return [];

  const intervals = busy.map((b) => ({
    start: new Date(b.starts_at).getTime() - BUFFER_MIN * 60000,
    end: new Date(b.ends_at).getTime() + BUFFER_MIN * 60000,
  }));

  const slots: Slot[] = [];
  const closing = new Date(date);
  closing.setHours(hours.close, 0, 0, 0);

  const cursor = new Date(date);
  cursor.setHours(hours.open, 0, 0, 0);

  while (cursor.getTime() + durationMin * 60000 <= closing.getTime()) {
    const start = new Date(cursor);
    const end = new Date(start.getTime() + durationMin * 60000);
    const overlaps = intervals.some((i) => start.getTime() < i.end && end.getTime() > i.start);
    const inPast = start.getTime() <= now.getTime() + 60 * 60000;
    slots.push({ start, end, available: !overlaps && !inPast });
    cursor.setMinutes(cursor.getMinutes() + SLOT_STEP_MIN);
  }
  return slots;
}

/** Dni pre výber (od dnes, len otvorené dni). */
export function upcomingDays(now: Date, count = BOOKING_HORIZON_DAYS): Date[] {
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    if (BUSINESS_HOURS[d.getDay()]) out.push(d);
  }
  return out;
}

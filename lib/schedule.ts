/**
 * Horarios calculados siempre en la zona horaria del restaurante
 * (America/Havana), nunca en la zona del dispositivo del usuario.
 * En la versión con backend, el servidor debe tener la última palabra.
 */
import { restaurant } from "@/config/restaurant";

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: restaurant.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export type ZonedNow = { dateKey: string; day: number; minutes: number };

export function zoned(date: Date): ZonedNow {
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    dateKey: `${p.year}-${p.month}-${p.day}`,
    day: WEEKDAY_INDEX[p.weekday as string],
    minutes: Number(p.hour) * 60 + Number(p.minute),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

function intervalsFor(z: ZonedNow) {
  if (restaurant.holidays.includes(z.dateKey)) return [];
  const day = restaurant.hours.find((h) => h.day === z.day);
  if (!day?.enabled) return [];
  return day.intervals.map((i) => ({ open: toMinutes(i.open), close: toMinutes(i.close) }));
}

/** Abierto y aún dentro del horario de aceptación de pedidos. */
export function isAcceptingAt(date: Date): boolean {
  const z = zoned(date);
  const cutoff = restaurant.ordering.lastOrderMinutesBeforeClose;
  return intervalsFor(z).some((i) => z.minutes >= i.open && z.minutes < i.close - cutoff);
}

function dayLabel(offset: number, day: number) {
  if (offset === 0) return "Hoy";
  if (offset === 1) return "Mañana";
  return DAY_NAMES[day][0].toUpperCase() + DAY_NAMES[day].slice(1);
}

/** Próxima apertura: "Hoy a las 12:00", "Mañana a las 12:00"… */
export function nextOpening(date: Date): string | null {
  for (let offset = 0; offset < 8; offset++) {
    const z = zoned(new Date(date.getTime() + offset * 86_400_000));
    const upcoming = intervalsFor(z)
      .filter((i) => offset > 0 || i.open > z.minutes)
      .sort((a, b) => a.open - b.open)[0];
    if (upcoming) return `${dayLabel(offset, z.day)} a las ${toHHMM(upcoming.open)}`;
  }
  return null;
}

export type Slot = { value: string; label: string; day: string };

/**
 * Franjas válidas para pedidos programados: respeta tiempo mínimo de
 * preparación, última hora de pedidos, feriados y días cerrados.
 * La capacidad máxima por franja requiere backend (pendiente).
 */
export function getSlots(date: Date): Slot[] {
  const { minPrepMinutes, slotMinutes, lastOrderMinutesBeforeClose, maxDaysAhead } = restaurant.ordering;
  const slots: Slot[] = [];
  for (let offset = 0; offset <= maxDaysAhead; offset++) {
    const z = zoned(new Date(date.getTime() + offset * 86_400_000));
    const earliestToday = offset === 0 ? z.minutes + minPrepMinutes : 0;
    for (const i of intervalsFor(z)) {
      const first = Math.max(i.open + minPrepMinutes, earliestToday);
      const start = Math.ceil(first / slotMinutes) * slotMinutes;
      const last = i.close - lastOrderMinutesBeforeClose;
      for (let m = start; m <= last; m += slotMinutes) {
        slots.push({ value: `${z.dateKey}T${toHHMM(m)}`, label: toHHMM(m), day: dayLabel(offset, z.day) });
      }
    }
  }
  return slots;
}

export function slotLabel(value: string, slots: Slot[]): string {
  const s = slots.find((x) => x.value === value);
  return s ? `${s.day}, ${s.label}` : value.replace("T", " ");
}

export function hoursSummary(): { day: string; text: string }[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((d) => {
    const h = restaurant.hours.find((x) => x.day === d);
    const name = DAY_NAMES[d][0].toUpperCase() + DAY_NAMES[d].slice(1);
    return {
      day: name,
      text: h?.enabled && h.intervals.length ? h.intervals.map((i) => `${i.open} – ${i.close}`).join(", ") : "Cerrado",
    };
  });
}

/** Horario de hoy ("12:00–22:00") o null si hoy está cerrado. Solo debe mostrarse con hoursStatus "confirmed". */
export function todayHours(date: Date = new Date()): string | null {
  const z = zoned(date);
  const list = intervalsFor(z);
  return list.length ? list.map((i) => `${toHHMM(i.open)}–${toHHMM(i.close)}`).join(", ") : null;
}

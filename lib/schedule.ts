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

/** "Todos los días · 12:30–19:00" si el horario es el mismo cada día; si no, null (se usa hoursSummary). */
export function hoursLine(): string | null {
  const rows = hoursSummary();
  const first = rows[0]?.text;
  if (!first || first === "Cerrado" || rows.some((r) => r.text !== first)) return null;
  return `Todos los días · ${first.replace(" – ", "–")}`;
}

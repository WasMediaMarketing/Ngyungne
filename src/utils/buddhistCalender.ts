import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/th"; // Thai locale for Buddhist calendar

dayjs.extend(buddhistEra);
dayjs.extend(utc);
dayjs.locale("th");

export function getBuddhistYear(date: Date): number {
  return dayjs(date).year() + 543;
}

export function getBuddhistDate(date: Date): string {
  return dayjs(date).format("D MMMM BBBB");
}

export function getLunarPhase(date: Date): string {
  const moonAge = getMoonAge(date);
  if (moonAge < 1 || moonAge > 29) return "New Moon";
  if (moonAge >= 7 && moonAge < 8) return "First Quarter";
  if (moonAge >= 14 && moonAge < 15) return "Full Moon";
  if (moonAge >= 21 && moonAge < 22) return "Last Quarter";
  return "";
}

export function isUposathaDay(date: Date): boolean {
  const moonPhase = getLunarPhase(date);
  return moonPhase === "New Moon" || moonPhase === "Full Moon";
}

// Helper function to calculate moon age
function getMoonAge(date: Date): number {
  const LUNAR_MONTH = 29.530588853;
  const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00.000Z");
  const diff = date.getTime() - KNOWN_NEW_MOON.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return ((days % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH;
}

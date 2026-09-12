/**
 * Opening hours and the booking slots derived from them.
 *
 *   Every day: 10:00 am – 8:30 pm
 *
 * The clinic keeps the same hours seven days a week, so there is no per-day
 * table here — one pair of times covers Monday through Sunday alike.
 *
 * The appointment form offers only the slots valid for the date the visitor
 * picked, and rejects a manually typed time that falls outside them.
 */

/** The one set of hours the clinic keeps, every day of the week. */
export const OPENING = { open: '10:00', close: '20:30' };

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Parses "YYYY-MM-DD" as a local date — avoids the UTC shift of new Date(str). */
export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "14:00" -> "2:00 pm" */
export function formatTime(hhmm) {
  const [hour, minute] = hhmm.split(':').map(Number);
  const period = hour >= 12 ? 'pm' : 'am';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${String(minute).padStart(2, '0')} ${period}`;
}

/** Opening hours for a "YYYY-MM-DD" date, or null if the date is unusable. */
export function hoursForDate(value) {
  const date = parseDate(value);
  if (!date) return null;
  return { ...OPENING, day: date.getDay(), dayName: DAY_NAMES[date.getDay()] };
}

/**
 * "10:00 am – 8:30 pm" — shown under the time field.
 *
 * No day name, because the hours are the same whichever date is picked.
 */
export function hoursLabel(value) {
  const hours = hoursForDate(value);
  if (!hours) return null;
  return `${formatTime(hours.open)} – ${formatTime(hours.close)}`;
}

/**
 * Bookable start times for a date, on the hour.
 *
 * The last slot starts one hour before closing so an appointment can finish
 * within opening hours.
 */
export function slotsForDate(value) {
  const hours = hoursForDate(value);
  if (!hours) return [];

  const slots = [];
  const last = toMinutes(hours.close) - 60;
  for (let minutes = toMinutes(hours.open); minutes <= last; minutes += 60) {
    const hhmm = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:00`;
    slots.push({ value: hhmm, label: formatTime(hhmm) });
  }
  return slots;
}

/** True when a "HH:MM" time falls inside that date's opening hours. */
export function isTimeWithinHours(dateValue, timeValue) {
  const hours = hoursForDate(dateValue);
  if (!hours || !/^\d{2}:\d{2}$/.test(timeValue || '')) return false;

  const minutes = toMinutes(timeValue);
  // Must start early enough to finish before closing.
  return minutes >= toMinutes(hours.open) && minutes <= toMinutes(hours.close) - 60;
}

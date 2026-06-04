/**
 * Client-safe date formatting for Insights posts. Kept separate from the
 * `fs`-based loader (insights.ts) so it can be imported into page components
 * without pulling Node modules into the browser bundle.
 */
export type Lang = "en" | "mn";

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_MN = [
  "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар",
  "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар",
];

/** Deterministic formatter (no locale/ICU dependency, so SSR and client agree). */
export function formatDate(iso: string, lang: Lang): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, year, month, day] = m;
  const idx = parseInt(month, 10) - 1;
  if (idx < 0 || idx > 11) return iso;
  return lang === "mn"
    ? `${year} оны ${MONTHS_MN[idx]} ${parseInt(day, 10)}`
    : `${MONTHS_EN[idx]} ${parseInt(day, 10)}, ${year}`;
}

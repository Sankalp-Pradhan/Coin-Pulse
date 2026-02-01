import { clsx, type ClassValue } from 'clsx';
import { Time } from 'lightweight-charts';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple class values into a single class string and resolve Tailwind class conflicts.
 *
 * @param inputs - Class values (strings, arrays, objects, etc.) to be merged
 * @returns The final class string with duplicates and conflicting Tailwind classes merged
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric value as a currency or plain number string.
 *
 * @param value - The numeric value to format; if `null`, `undefined`, or `NaN` a zero fallback is returned.
 * @param digits - Number of fraction digits to display (default 2).
 * @param currency - ISO 4217 currency code to use when showing a currency symbol (default 'USD').
 * @param showSymbol - When `false`, omit the currency symbol and format as a plain number; when `true` or `undefined`, include the currency symbol.
 * @returns A formatted string. For invalid input (`null`/`undefined`/`NaN`) returns `'$0.00'` (or `'0.00'` if `showSymbol` is `false`). Otherwise returns the value formatted according to the specified digits and currency settings.
 */
export function formatCurrency(
  value: number | null | undefined,
  digits?: number,
  currency?: string,
  showSymbol?: boolean,
) {
  if (value === null || value === undefined || isNaN(value)) {
    return showSymbol !== false ? '$0.00' : '0.00';
  }

  if (showSymbol === undefined || showSymbol === true) {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: currency?.toUpperCase() || 'USD',
      minimumFractionDigits: digits ?? 2,
      maximumFractionDigits: digits ?? 2,
    });
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits ?? 2,
    maximumFractionDigits: digits ?? 2,
  });
}

/**
 * Formats a numeric change as a percentage string with one decimal place.
 *
 * @param change - The numeric change to format; `null`, `undefined`, or `NaN` are treated as zero.
 * @returns `'0.0%'` if `change` is `null`, `undefined`, or `NaN`; otherwise the percentage string with one decimal place (for example, `'1.2%'`).
 */
export function formatPercentage(change: number | null | undefined): string {
  if (change === null || change === undefined || isNaN(change)) {
    return '0.0%';
  }
  const formattedChange = change.toFixed(1);
  return `${formattedChange}%`;
}

/**
 * Determines CSS classes for displaying a positive or negative trend.
 *
 * @param value - Numeric change where a value greater than 0 represents an upward trend.
 * @returns An object with `textClass`, `bgClass`, and `iconClass`:
 * - `textClass`: green for upward trends, red for downward or zero.
 * - `bgClass`: light green background for upward trends, light red for downward or zero.
 * - `iconClass`: `'icon-up'` for upward trends, `'icon-down'` otherwise.
 */
export function trendingClasses(value: number) {
  const isTrendingUp = value > 0;

  return {
    textClass: isTrendingUp ? 'text-green-400' : 'text-red-400',
    bgClass: isTrendingUp ? 'bg-green-500/10' : 'bg-red-500/10',
    iconClass: isTrendingUp ? 'icon-up' : 'icon-down',
  };
}

/**
 * Produces a human-readable relative time string for a past date or a YYYY-MM-DD date for older times.
 *
 * Accepts a Date object, an ISO/string timestamp, or a numeric epoch (milliseconds). For times:
 * - < 60 seconds → "just now"
 * - < 60 minutes → "`X` min"
 * - < 24 hours → "`X` hour(s)"
 * - < 7 days → "`X` day(s)"
 * - < ~4 weeks → "`X` week(s)"
 * Otherwise returns the date formatted as `YYYY-MM-DD`.
 *
 * @param date - The past date to format (Date | string | number)
 * @returns A relative time string (e.g., "just now", "5 min", "2 hours", "3 days", "1 week") or a `YYYY-MM-DD` date string for older dates
 */
export function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime(); // difference in ms

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''}`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''}`;

  // Format date as YYYY-MM-DD
  return past.toISOString().split('T')[0];
}

/**
 * Converts an array of OHLC tuples into an array of objects with Time and OHLC fields, removing consecutive entries that share the same time.
 *
 * @param data - Array of OHLC tuples in the form `[time, open, high, low, close]` where `time` is expressed in seconds.
 * @returns An array of objects `{ time: Time; open: number; high: number; low: number; close: number }` with duplicate consecutive `time` values collapsed (first occurrence kept).
 */
export function convertOHLCData(data: OHLCData[]) {
  return data
    .map((d) => ({
      time: d[0] as Time, // ensure seconds, not ms
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }))
    .filter((item, index, arr) => index === 0 || item.time !== arr[index - 1].time);
}

export const ELLIPSIS = 'ellipsis' as const;
export const buildPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | typeof ELLIPSIS)[] => {
  const MAX_VISIBLE_PAGES = 5;

  const pages: (number | typeof ELLIPSIS)[] = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push(ELLIPSIS);
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push(ELLIPSIS);
  }

  pages.push(totalPages);

  return pages;
};
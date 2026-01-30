import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'  // Also fixed typo: 'em-US' -> 'en-US'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,  // Changed from 'currency' to currency
  }).format(value);
}
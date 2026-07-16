import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CURRENCY } from "@/lib/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TODO: wire locale/currency from settings once the backend exposes them.
export function formatPrice(amount: number, currency: string = CURRENCY) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

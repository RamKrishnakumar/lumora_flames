import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names (via clsx) and resolves
 * Tailwind CSS class conflicts intelligently (via tailwind-merge).
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

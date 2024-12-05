import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWalletAddress(address: string): string {
  if (address.length <= 6) {
    return address; // If the address is too short, return it as is
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

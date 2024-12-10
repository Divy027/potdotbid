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


export function formatTime(timestamp: string) {
  const timeDiff = (new Date().getTime() - new Date(timestamp).getTime()) / 1000;
  if (timeDiff < 60) {
    return `${Math.floor(timeDiff)} seconds ago`;
  } else if (timeDiff < 3600) {
    return `${Math.floor(timeDiff / 60)} minutes ago`;
  } else if (timeDiff < 86400) {
    return `${Math.floor(timeDiff / 3600)} hours ago`;
  } else {
    return `${Math.floor(timeDiff / 86400)} days ago`;
  }
}

export const formatNumber = (num: number): string => {
  
  if (num < 1000) {
    return num.toString(); // Return as is for numbers less than 1,000
  }

  const units = ["", "k", "m", "b", "t"]; // Thousand, Million, Billion, Trillion
  const unitIndex = Math.floor(Math.log10(num) / 3); // Determine the unit (k, m, b, t)
  
  const scaledNumber = num / Math.pow(1000, unitIndex); // Scale the number
  
  return `${scaledNumber.toFixed(1).replace(/\.0$/, "")}${units[unitIndex]}`;
};

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface OHLCTimestampData {
  time: number; // Timestamp of the OHLC data point
  open: number; // Open price
  high: number; // High price
  low: number; // Low price
  close: number; // Close price
}

interface PriceData {
  time: number; // Timestamp in seconds
  price: number; // Price in ETH
}

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

export const generateOHLCData = (priceData: PriceData[], intervalInMinutes: number): OHLCTimestampData[] => {
  const ohlcData: OHLCTimestampData[] = [];
  console.log(priceData)
  // Edge case: if priceData is empty
  if (priceData.length === 0) {
    return [];
  }

  let intervalStart = priceData[0].time; // Start of the first interval
  let open = priceData[0].price; // The first price is the open for the first interval
  let high = priceData[0].price; // The first price is the initial high
  let low = priceData[0].price; // The first price is the initial low
  let close = priceData[0].price; // The first price is the initial close

  const intervalInSeconds = intervalInMinutes * 60;

  for (let i = 1; i < priceData.length; i++) {
    const currentData = priceData[i];

    if (currentData.time < intervalStart + intervalInSeconds) {
      high = Math.max(high, currentData.price);
      low = Math.min(low, currentData.price);
      close = currentData.price; // Update close to the latest price
    } else {
      console.log(`Pushing OHLC data: time=${intervalStart}, open=${(open)}, high=${high}, low=${low}, close=${close}`);
      
      ohlcData.push({
        time: intervalStart , // Convert to milliseconds
        open: (open),
        high: (high),
        low: (low),
        close: (close),
      });

      // Reset for the next interval
      intervalStart = currentData.time;
      open = currentData.price;
      high = currentData.price;
      low = currentData.price;
      close = currentData.price;
    }
  }

  console.log(`Pushing final OHLC data: time=${intervalStart}, open=${open}, high=${high}, low=${low}, close=${close}`);
  
  ohlcData.push({
    time: intervalStart, // Convert to milliseconds
    open: (open),
    high: (high),
    low: (low),
    close:(close),
  });

  return ohlcData;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function delay(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


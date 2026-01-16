import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.digitalmarketer.co.kr";

  // If it's localhost, use production URL for SEO/schema purposes
  if (baseUrl.includes("localhost")) {
    return `https://www.digitalmarketer.co.kr${path}`;
  }

  return `${baseUrl}${path}`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

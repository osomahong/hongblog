import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SITE_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  // If it's localhost, use production URL for SEO/schema purposes
  if (SITE_URL.includes("localhost")) {
    return `https://www.digitalmarketer.co.kr${path}`;
  }

  return `${SITE_URL}${path}`;
}


export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

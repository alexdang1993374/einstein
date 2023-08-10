import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const absoluteUrl = (path: string): string => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// 生成一个n,m之间的随机数
export const randomNum = (n: number, m: number) => Math.floor(Math.random() * (m - n + 1) + n);
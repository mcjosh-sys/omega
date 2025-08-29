import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStripeOAuthLink(
  accountType: "agency" | "subaccount",
  state: string
) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}${accountType}&state=${state}`;
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function execute<R>(
  fn: (...args: any[]) => Promise<R>,
  ...args: any[]
): Promise<R> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fn(...args);
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}

export const numberFormatter = (value: number) => {
  return `${value / 1000}k`;
};

export function formatCurrency(value: number) {
  const suffixes = ["", "k", "m", "b", "t"]; // Suffixes for thousands, millions, billions, trillions, etc.

  const suffixIndex = Math.floor(("" + value).length / 3); // Determine the index of the suffix based on the number of digits

  let formattedNumber = parseFloat(
    (value / Math.pow(1000, suffixIndex)).toFixed(2)
  ); // Divide the number by 1000^suffixIndex and round to 2 decimal places

  if (formattedNumber % 1 !== 0) {
    // Remove decimal if it's .00
    formattedNumber = +formattedNumber.toFixed(2);
  }

  return "$" + formattedNumber + suffixes[suffixIndex];
}

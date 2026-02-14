import * as dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const val = process.env[name] ?? fallback;
  if (val === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export const env = {
  BASE_URL: getEnv("BASE_URL", "https://playground.testduo.co.za"),
  E2E_EMAIL: process.env.E2E_EMAIL ?? "",
  E2E_PASSWORD: process.env.E2E_PASSWORD ?? ""
};

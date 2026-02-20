// This file is responsible for loading environment variables from a .env 
// file and providing a utility function to access these variables. It uses 
// the `dotenv` package to load the environment variables into `process.env`. 
// The `getEnv` function is defined to retrieve the value of an environment 
// variable by its name, with an optional fallback value. If the environment 
// variable is not found and no fallback is provided, it throws an error. 
// The `env` object is then exported, containing specific environment variables 
// that are used in the application, such as `BASE_URL`, `E2E_EMAIL`, 
// and `E2E_PASSWORD`. This allows other parts of the application to easily 
// access these configuration values.

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

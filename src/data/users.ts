import { env } from "../utils/env";

export type User = {
  email: string;
  password: string;
};

export const users = {
  primary(): User {
    return {
      email: env.E2E_EMAIL,
      password: env.E2E_PASSWORD
    };
  }
};

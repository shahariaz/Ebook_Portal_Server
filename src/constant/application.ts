export enum EApplicationEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

export const DatabaseConst = {
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 5000,
} as const;

import dotenvFlow from "dotenv-flow";
import path from "path";

dotenvFlow.config({
  path: path.resolve(process.cwd()),
  node_env: process.env.NODE_ENV,
});

class Config {
  readonly PORT: number;
  readonly NODE_ENV: string;

  constructor() {
    this.PORT = parseInt(process.env.PORT!);
    this.NODE_ENV = process.env.NODE_ENV!;
    this.validateConfig();
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Config error: ${key} is undefined`);
      }
    }
  }
}
export const config: Config = new Config();

import express, { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import { EApplicationEnv } from "./constant/application";

const app = express();

app.get("/", (req, res) => {
  const error = createHttpError(400, "something went wrong");
  throw error;
  res.send("Hello World");
});

// Global Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  if (config.NODE_ENV === EApplicationEnv.DEVELOPMENT) {
    console.error(err);
  }
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        errorStack:
          config.NODE_ENV === EApplicationEnv.DEVELOPMENT
            ? err.stack
            : undefined,
        path: "",
        location: "",
      },
    ],
  });
});
export default app;

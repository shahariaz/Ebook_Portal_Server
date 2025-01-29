import { HttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";
import { EApplicationEnv } from "../constant/application";
import { config } from "../config/config";
const globalErrorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
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
};
export default globalErrorHandler;

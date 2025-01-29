import { NextFunction, Request, Response } from "express";
import { THttpErrorResponse } from "../types/type";

export default (
  err: Partial<THttpErrorResponse>,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction
) => {
  let parsedMessage: string | JSON;
  try {
    parsedMessage =
      typeof err.message === "string" && err.message.startsWith("[")
        ? (JSON.parse(err.message) as JSON)
        : String(err.message || "Internal Server Error");
  } catch {
    parsedMessage = String(err.message || "Internal Server Error");
  }
  const errorResponse: THttpErrorResponse = {
    success: err.success || false,
    statusCode: err.statusCode || 500,
    request: {
      ip: err.request?.ip,
      method: err.request?.method,
      url: err.request?.url,
    },
    message: parsedMessage || "Internal Server Error",
    data: err.data || null,
    trace: err.trace || null,
  };

  res.status(errorResponse.statusCode).json(errorResponse);
};

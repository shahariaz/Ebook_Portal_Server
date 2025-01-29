import { Request } from "express";
import { THttpErrorResponse } from "../types/type";

import { config } from "../config/config";
import { EApplicationEnv } from "../constant/application";
import responseMessage from "../constant/responseMessage";

export default (
  err: Error | unknown,
  req: Request,
  errorStatusCode: number = 500
): THttpErrorResponse => {
  const errorMessage =
    err instanceof Error ? err.message : responseMessage.INTERNAL_SERVER_ERROR;

  const errorObj: THttpErrorResponse = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message: errorMessage,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null,
  };

  // Hide sensitive data in production
  if (config.NODE_ENV === EApplicationEnv.PRODUCTION) {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return errorObj;
};

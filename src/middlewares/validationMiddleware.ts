import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import httpError from "../utils/httpError";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body);
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error);
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return httpError(
          next,
          new Error(JSON.stringify(formattedErrors)),
          req,
          400
        );
      }

      return httpError(next, error, req, 500);
    }
  };
};

import express, { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
  const error = createHttpError(400, "something went wrong");
  throw error;
  res.send("Hello World");
});

// Global Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);
export default app;

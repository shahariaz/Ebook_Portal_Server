import express, { Request, Response } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./router/userRouter";

const app = express();

app.get("/", (req: Request, res: Response) => {
  const error = createHttpError(400, "something went wrong");
  throw error;
  res.send("Hello World");
});

//API Router
app.use("/api/v1/users", userRouter);

// Global Error Handler
app.use(globalErrorHandler);
export default app;

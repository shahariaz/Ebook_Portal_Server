import express from "express";
import { config } from "./config/config";

const app = express();
console.log(config.PORT);
export default app;

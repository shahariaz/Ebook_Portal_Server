import express from "express";
import UserController from "../controllers/userController";
import { validate } from "../middlewares/validationMiddleware";
import { registrationSchema } from "../validator/registration.validator";

const router = express.Router();
const userController: UserController = new UserController();
router.post("/register", validate(registrationSchema), userController.create);

export default router;

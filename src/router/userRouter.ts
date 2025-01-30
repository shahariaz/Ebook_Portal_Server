import express from "express";
import UserController from "../controllers/userController";
import { validate } from "../middlewares/validationMiddleware";
import { registrationSchema } from "../validator/registration.validator";
import UserService from "../service/user.service";
import User from "../model/userModel";
const userRepo = new UserService(User);
const router = express.Router();
const userController: UserController = new UserController(userRepo);
router.post("/register", validate(registrationSchema), userController.create);

export default router;

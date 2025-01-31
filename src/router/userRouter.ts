import express from "express";
import UserController from "../controllers/userController";
import { validate } from "../middlewares/validationMiddleware";
import { registrationSchema } from "../validator/registration.validator";
import UserService from "../service/user.service";
import User from "../model/userModel";
const userService: UserService = new UserService(User);
console.log("userService", userService);
const userController: UserController = new UserController(userService);
console.log("Controller instance:", userController);
const router = express.Router();
router.post("/register", validate(registrationSchema), userController.create);

export default router;

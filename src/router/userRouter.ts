import express from "express";
import UserController from "../controllers/userController";

const router = express.Router();
const userController: UserController = new UserController();
router.post("/register", userController.create);

export default router;

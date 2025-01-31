import { Request, Response, NextFunction } from "express";
import UserService from "../service/user.service";

export default class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body;
      const isUserExist = await this.userService.findByEmail(userData.email);
      if (isUserExist) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
        return;
      }
      const user = await this.userService.createUser(userData);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

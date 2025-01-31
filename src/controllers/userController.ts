import { NextFunction, Request, Response } from "express";
import UserService from "../service/user.service";
import httpError from "../utils/httpError";

class UserController {
  constructor(private userService: UserService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const isUserExist = await this.userService.findByEmail(email);

      if (isUserExist) {
        httpError(next, "User Already Exist", req, 400);
      }
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      httpError(next, error, req);
    }
  }
}

export default UserController;

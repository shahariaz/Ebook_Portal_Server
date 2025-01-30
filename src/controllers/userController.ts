import { Request, Response } from "express";
import UserService from "../service/user.service";
class UserController {
  constructor(private userService: UserService) {}
  async create(req: Request, res: Response) {
    console.log(req.body);
  }
}

export default UserController;

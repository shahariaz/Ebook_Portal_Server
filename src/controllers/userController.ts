import { Request, Response } from "express";
class UserController {
  async create(req: Request, res: Response) {
    res.send("User created");
  }
}

export default UserController;

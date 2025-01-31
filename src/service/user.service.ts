import { Model } from "mongoose";
import { IUser } from "../types/interface";
import createHttpError from "http-errors";

class UserService {
  constructor(private userRepo: Model<IUser>) {}

  async findByEmail(email: string): Promise<IUser | null> {
    console.log("email", email);
    try {
      console.log("email", email);
      const user = await this.userRepo.findOne({ email });
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      console.error("Error fetching user:", err);
      const error = createHttpError(
        500,
        "An error occurred while fetching user"
      );
      throw error;
    }
  }

  async createUser(payload: IUser): Promise<IUser> {
    try {
      const user = await this.userRepo.create(payload);
      return user;
    } catch (err) {
      console.error("Error creating user:", err);
      const error = createHttpError(
        500,
        "An error occurred while creating user"
      );
      throw error;
    }
  }

  async updateUser(
    userId: string,
    payload: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findByIdAndUpdate(userId, payload, {
        new: true,
      });
      if (!user) {
        throw createHttpError(404, "User not found");
      }
      return user;
    } catch (err) {
      console.error("Error updating user:", err);
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        err.name === "ValidationError"
      ) {
        const error = createHttpError(400, "Invalid data provided");
        throw error;
      }
      const error = createHttpError(
        500,
        "An error occurred while updating user"
      );
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findByIdAndDelete(userId);
      if (!user) {
        throw createHttpError(404, "User not found");
      }
      return user;
    } catch (err) {
      console.error("Error deleting user:", err);
      const error = createHttpError(
        500,
        "An error occurred while deleting user"
      );
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await this.userRepo.find();
      return users;
    } catch (err) {
      console.error("Error fetching users:", err);
      const error = createHttpError(
        500,
        "An error occurred while fetching users"
      );
      throw error;
    }
  }

  async verifyUser(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findByIdAndUpdate(
        userId,
        { isVerified: true },
        { new: true }
      );
      if (!user) {
        throw createHttpError(404, "User not found");
      }
      return user;
    } catch (err) {
      console.error("Error verifying user:", err);
      const error = createHttpError(
        500,
        "An error occurred while verifying user"
      );
      throw error;
    }
  }
}

export default UserService;

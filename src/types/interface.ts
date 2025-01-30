import { Document } from "mongoose";

export interface IDatabaseConnection {
  retryCount: number;
  isConnected: boolean;
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
  SUPERADMIN = "superadmin",
  AUTHOR = "author",
}
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  fullName: string; // Virtual field
  comparePassword(candidatePassword: string): Promise<boolean>;
}

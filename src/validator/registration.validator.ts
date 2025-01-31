import { z } from "zod";
export const registrationSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: "Email is required" })
      .min(5, "Name must be at least 5 characters long")
      .max(50, "Name must be at most 50 characters long"),
    lastName: z
      .string({ required_error: "Email is required" })
      .min(5, "Name must be at least 5 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: z
      .string()
      .email("Invalid email format.")
      .min(5, "Email must be at least 5 characters long")
      .max(50, "Email must be at most 50 characters long")
      .trim(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    role: z.string().optional(),
    isVerified: z.boolean().optional(),
    lastLogin: z.number().optional(),
    avatar: z.string().optional(),
  }),
});

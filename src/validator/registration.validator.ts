import { z } from "zod";

export const registrationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(5, "Name must be at least 5 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: z
      .string()
      .email("Invalid email format.")
      .min(5, "Email must be at least 5 characters long")
      .max(50, "Email must be at most 50 characters long")
      .trim(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

import { z } from "zod";

// Username rules
export const usernameValidation = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters.")
  .max(20, "Username cannot exceed 20 characters.")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed.");

// Password rules
export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Must contain at least one number.")
  .regex(/[@$!%*?&]/, "Must contain at least one special character.");

// Signup schema
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().trim().email("Invalid email format."),
  password: passwordValidation,
});

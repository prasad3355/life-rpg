import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, "Character name must be at least 2 characters")
    .max(30, "Character name must be 30 characters or less"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Passphrase must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
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

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Character name must be at least 2 characters")
    .max(30, "Character name must be 30 characters or less")
    .optional(),
  level: z.number().int().min(1).optional(),
  xp: z.number().int().min(0).optional(),
  xpToNextLevel: z.number().int().min(1).optional(),
  gold: z.number().int().min(0).optional(),
  streakDays: z.number().int().min(0).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
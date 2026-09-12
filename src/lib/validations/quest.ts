import { z } from "zod";

export const createQuestSchema = z.object({
  title: z
    .string()
    .min(1, "Quest title is required")
    .max(100, "Quest title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  category: z.enum(["Daily", "Main Quest", "Side Quest", "Fitness", "Learning", "Work"]).default("Daily"),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Epic"]).default("Medium"),
  xp: z.number().int().min(10, "XP must be at least 10").max(5000, "XP cannot exceed 5000").default(100),
  gold: z.number().int().min(0, "Gold cannot be negative").max(10000, "Gold cannot exceed 10000").default(50),
});

export const updateQuestSchema = createQuestSchema.partial().extend({
  status: z.enum(["available", "in-progress", "completed", "failed"]).optional(),
});

export const updateQuestStatusSchema = z.object({
  status: z.enum(["available", "in-progress", "completed", "failed"]),
});

export type CreateQuestInput = z.infer<typeof createQuestSchema>;
export type UpdateQuestInput = z.infer<typeof updateQuestSchema>;
export type UpdateQuestStatusInput = z.infer<typeof updateQuestStatusSchema>;
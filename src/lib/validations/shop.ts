import { z } from "zod";

export const createRewardSchema = z.object({
  title: z
    .string()
    .min(1, "Reward title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  cost: z.number().int().min(0, "Cost cannot be negative").default(100),
  icon: z.string().optional().default("gift"),
  category: z.string().default("General"),
  isAvailable: z.boolean().default(true),
});

export const purchaseRewardSchema = z.object({
  rewardId: z.string().min(1, "Reward ID is required"),
});

export const updateInventoryItemSchema = z.object({
  isEquipped: z.boolean().optional(),
  quantity: z.number().int().min(0, "Quantity cannot be negative").optional(),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type PurchaseRewardInput = z.infer<typeof purchaseRewardSchema>;
export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;

import { z } from "zod";

export const createAttributeSchema = z.object({
  name: z
    .string()
    .min(1, "Attribute name is required")
    .max(50, "Attribute name must be 50 characters or less"),
  value: z.number().int().min(0, "Value cannot be negative").default(10),
  max: z.number().int().min(1, "Max value must be at least 1").default(100),
});

export const updateAttributeSchema = createAttributeSchema.partial();

export type CreateAttributeInput = z.infer<typeof createAttributeSchema>;
export type UpdateAttributeInput = z.infer<typeof updateAttributeSchema>;

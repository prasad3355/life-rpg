import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateInventoryItemSchema } from "@/lib/validations/shop";
import {
  apiSuccess,
  apiError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  validationError,
  serverError,
} from "@/lib/api";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const { id } = await context.params;

    if (!id) {
      return apiError("Inventory item ID is required", 400);
    }

    const body = await req.json();
    const parsed = updateInventoryItemSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const item = await db.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) {
      return notFoundError("Inventory item not found");
    }

    if (item.userId !== session.userId) {
      return forbiddenError("You do not own this inventory item");
    }

    const updatedItem = await db.inventoryItem.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess({ item: updatedItem });
  } catch (error) {
    return serverError(error, "Failed to update inventory item");
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const { id } = await context.params;

    if (!id) {
      return apiError("Inventory item ID is required", 400);
    }

    const item = await db.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) {
      return notFoundError("Inventory item not found");
    }

    if (item.userId !== session.userId) {
      return forbiddenError("You do not own this inventory item");
    }

    await db.inventoryItem.delete({
      where: { id },
    });

    return apiSuccess({ id }, "Inventory item removed");
  } catch (error) {
    return serverError(error, "Failed to delete inventory item");
  }
}

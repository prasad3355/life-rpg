import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { purchaseRewardSchema } from "@/lib/validations/shop";
import {
  apiSuccess,
  apiError,
  unauthorizedError,
  notFoundError,
  validationError,
  serverError,
} from "@/lib/api";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const body = await req.json();
    const parsed = purchaseRewardSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { rewardId } = parsed.data;

    // 1. Fetch requested reward from DB
    const reward = await db.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      return notFoundError("Reward not found");
    }

    if (!reward.isAvailable) {
      return apiError("This reward is currently unavailable for purchase", 400);
    }

    // 2. Fetch authenticated user from DB to verify server-side gold balance
    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return notFoundError("User not found");
    }

    if (user.gold < reward.cost) {
      return apiError(
        `Insufficient Gold balance. You need ${reward.cost} Gold, but currently have ${user.gold} Gold.`,
        400,
        { requiredGold: reward.cost, currentGold: user.gold }
      );
    }

    // 3. Execute atomic transaction to update currency, record purchase, and update inventory
    const result = await db.$transaction(async (tx) => {
      // Deduct gold balance from user
      const updatedUser = await tx.user.update({
        where: { id: session.userId },
        data: {
          gold: {
            decrement: reward.cost,
          },
        },
        select: {
          id: true,
          gold: true,
          level: true,
          xp: true,
        },
      });

      // Record transaction history
      const purchaseRecord = await tx.purchase.create({
        data: {
          userId: session.userId,
          rewardId: reward.id,
          cost: reward.cost,
        },
      });

      // Check if user already owns an inventory item for this reward
      const existingInventoryItem = await tx.inventoryItem.findFirst({
        where: {
          userId: session.userId,
          rewardId: reward.id,
        },
      });

      let inventoryItem;
      if (existingInventoryItem) {
        inventoryItem = await tx.inventoryItem.update({
          where: { id: existingInventoryItem.id },
          data: {
            quantity: {
              increment: 1,
            },
          },
        });
      } else {
        inventoryItem = await tx.inventoryItem.create({
          data: {
            userId: session.userId,
            rewardId: reward.id,
            title: reward.title,
            description: reward.description,
            icon: reward.icon,
            quantity: 1,
          },
        });
      }

      // Log activity
      await tx.activityLog.create({
        data: {
          userId: session.userId,
          text: `Purchased '${reward.title}'`,
          extra: `-${reward.cost} Gold`,
        },
      });

      return {
        user: updatedUser,
        purchase: purchaseRecord,
        inventoryItem,
      };
    });

    return apiSuccess(
      {
        message: `Successfully purchased '${reward.title}'!`,
        goldRemaining: result.user.gold,
        purchase: result.purchase,
        inventoryItem: result.inventoryItem,
      },
      "Purchase completed successfully",
      200
    );
  } catch (error) {
    return serverError(error, "Failed to process shop purchase");
  }
}

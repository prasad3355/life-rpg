import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateQuestStatusSchema } from "@/lib/validations/quest";
import { processXpGain } from "@/lib/rpg";
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
      return apiError("Quest ID is required", 400);
    }

    const body = await req.json();
    const parsed = updateQuestStatusSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { status: newStatus } = parsed.data;

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return notFoundError("Quest not found");
    }

    if (quest.userId !== session.userId) {
      return forbiddenError("You do not own this quest");
    }

    const previousStatus = quest.status;
    let userRewards = null;

    if (newStatus === "completed" && previousStatus !== "completed") {
      const user = await db.user.findUnique({
        where: { id: session.userId },
      });

      if (user) {
        const xpGainResult = processXpGain(
          user.xp,
          user.level,
          user.xpToNextLevel,
          quest.xp
        );

        const updatedUser = await db.user.update({
          where: { id: session.userId },
          data: {
            xp: xpGainResult.xp,
            level: xpGainResult.level,
            xpToNextLevel: xpGainResult.xpToNextLevel,
            gold: user.gold + quest.gold,
          },
          select: {
            id: true,
            level: true,
            xp: true,
            xpToNextLevel: true,
            gold: true,
          },
        });

        await db.activityLog.create({
          data: {
            userId: session.userId,
            text: `Completed '${quest.title}'`,
            extra: `+${quest.xp} XP, +${quest.gold} Gold${
              xpGainResult.leveledUp ? ` | Level Up to Lvl ${xpGainResult.level}!` : ""
            }`,
          },
        });

        userRewards = {
          xpGained: quest.xp,
          goldGained: quest.gold,
          leveledUp: xpGainResult.leveledUp,
          user: updatedUser,
        };
      }
    }

    const updatedQuest = await db.quest.update({
      where: { id },
      data: { status: newStatus },
    });

    return apiSuccess({ quest: updatedQuest, userRewards });
  } catch (error) {
    return serverError(error, "Failed to update quest status");
  }
}

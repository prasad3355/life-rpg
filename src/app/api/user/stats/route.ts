import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { apiSuccess, unauthorizedError, notFoundError, serverError } from "@/lib/api";
import { getLevelProgressPercent } from "@/lib/rpg";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      include: {
        attributes: true,
        _count: {
          select: {
            quests: true,
            activityLogs: true,
          },
        },
      },
    });

    if (!user) {
      return notFoundError("User not found");
    }

    const [completedQuests, inProgressQuests, availableQuests, failedQuests] =
      await Promise.all([
        db.quest.count({ where: { userId: session.userId, status: "completed" } }),
        db.quest.count({ where: { userId: session.userId, status: "in-progress" } }),
        db.quest.count({ where: { userId: session.userId, status: "available" } }),
        db.quest.count({ where: { userId: session.userId, status: "failed" } }),
      ]);

    const levelProgressPercent = getLevelProgressPercent(
      user.xp,
      user.xpToNextLevel
    );

    const stats = {
      level: user.level,
      xp: user.xp,
      xpToNextLevel: user.xpToNextLevel,
      levelProgressPercent,
      gold: user.gold,
      streakDays: user.streakDays,
      attributesCount: user.attributes.length,
      attributes: user.attributes,
      quests: {
        total: user._count.quests,
        completed: completedQuests,
        inProgress: inProgressQuests,
        available: availableQuests,
        failed: failedQuests,
        completionRate:
          user._count.quests > 0
            ? Math.round((completedQuests / user._count.quests) * 100)
            : 0,
      },
      activityLogsCount: user._count.activityLogs,
    };

    return apiSuccess({ stats });
  } catch (error) {
    return serverError(error, "Failed to calculate user stats");
  }
}

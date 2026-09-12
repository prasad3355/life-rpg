import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateQuestStatusSchema } from "@/lib/validations/quest";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Quest ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateQuestStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { status: newStatus } = parsed.data;

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    if (quest.userId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this quest" },
        { status: 403 }
      );
    }

    const previousStatus = quest.status;
    let userRewards = null;

    if (newStatus === "completed" && previousStatus !== "completed") {
      const user = await db.user.findUnique({
        where: { id: session.userId },
      });

      if (user) {
        let newXp = user.xp + quest.xp;
        let newLevel = user.level;
        let xpToNext = user.xpToNextLevel;
        let leveledUp = false;

        while (newXp >= xpToNext) {
          newXp -= xpToNext;
          newLevel += 1;
          xpToNext = 1000 * newLevel;
          leveledUp = true;
        }

        const updatedUser = await db.user.update({
          where: { id: session.userId },
          data: {
            xp: newXp,
            level: newLevel,
            xpToNextLevel: xpToNext,
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
              leveledUp ? ` | Level Up to Lvl ${newLevel}!` : ""
            }`,
          },
        });

        userRewards = {
          xpGained: quest.xp,
          goldGained: quest.gold,
          leveledUp,
          user: updatedUser,
        };
      }
    }

    const updatedQuest = await db.quest.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json(
      { quest: updatedQuest, userRewards },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating quest status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateQuestSchema } from "@/lib/validations/quest";
import {
  apiSuccess,
  apiError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  validationError,
  serverError,
} from "@/lib/api";

export async function GET(
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

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return notFoundError("Quest not found");
    }

    if (quest.userId !== session.userId) {
      return forbiddenError("You do not own this quest");
    }

    return apiSuccess({ quest });
  } catch (error) {
    return serverError(error, "Error fetching quest");
  }
}

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
    const parsed = updateQuestSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return notFoundError("Quest not found");
    }

    if (quest.userId !== session.userId) {
      return forbiddenError("You do not own this quest");
    }

    const updatedQuest = await db.quest.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess({ quest: updatedQuest });
  } catch (error) {
    return serverError(error, "Error updating quest");
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
      return apiError("Quest ID is required", 400);
    }

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return notFoundError("Quest not found");
    }

    if (quest.userId !== session.userId) {
      return forbiddenError("You do not own this quest");
    }

    await db.quest.delete({
      where: { id },
    });

    await db.activityLog.create({
      data: {
        userId: session.userId,
        text: `Deleted quest '${quest.title}'`,
      },
    });

    return apiSuccess({ id }, "Quest deleted successfully");
  } catch (error) {
    return serverError(error, "Error deleting quest");
  }
}

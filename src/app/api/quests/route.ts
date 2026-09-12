import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createQuestSchema } from "@/lib/validations/quest";
import {
  apiSuccess,
  unauthorizedError,
  validationError,
  serverError,
} from "@/lib/api";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const whereClause: {
      userId: string;
      status?: string;
      category?: string;
    } = {
      userId: session.userId,
    };

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const quests = await db.quest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ quests });
  } catch (error) {
    return serverError(error, "Error fetching quests");
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const body = await req.json();
    const parsed = createQuestSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const quest = await db.quest.create({
      data: {
        ...parsed.data,
        userId: session.userId,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.userId,
        text: `Created new quest '${quest.title}'`,
      },
    });

    return apiSuccess({ quest }, "Quest created successfully", 201);
  } catch (error) {
    return serverError(error, "Error creating quest");
  }
}

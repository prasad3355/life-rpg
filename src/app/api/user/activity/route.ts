import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { apiSuccess, unauthorizedError, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 20, 1), 100) : 20;

    const activities = await db.activityLog.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return apiSuccess({ activities });
  } catch (error) {
    return serverError(error, "Error fetching activity logs");
  }
}


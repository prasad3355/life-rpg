import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { apiSuccess, unauthorizedError, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const inventory = await db.inventoryItem.findMany({
      where: { userId: session.userId },
      include: {
        reward: {
          select: {
            id: true,
            title: true,
            cost: true,
            category: true,
          },
        },
      },
      orderBy: { acquiredAt: "desc" },
    });

    return apiSuccess({ inventory });
  } catch (error) {
    return serverError(error, "Failed to fetch inventory");
  }
}

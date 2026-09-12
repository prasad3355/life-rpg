import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createRewardSchema } from "@/lib/validations/shop";
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
    const category = searchParams.get("category");

    const whereClause: { isAvailable: boolean; category?: string } = {
      isAvailable: true,
    };

    if (category) {
      whereClause.category = category;
    }

    const rewards = await db.reward.findMany({
      where: whereClause,
      orderBy: { cost: "asc" },
    });

    return apiSuccess({ rewards });
  } catch (error) {
    return serverError(error, "Failed to fetch rewards");
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const body = await req.json();
    const parsed = createRewardSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const reward = await db.reward.create({
      data: parsed.data,
    });

    return apiSuccess({ reward }, "Reward created successfully", 201);
  } catch (error) {
    return serverError(error, "Failed to create reward");
  }
}

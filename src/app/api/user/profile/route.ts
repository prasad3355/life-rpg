import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations/auth";
import {
  apiSuccess,
  unauthorizedError,
  notFoundError,
  validationError,
  serverError,
} from "@/lib/api";

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
        activityLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            quests: true,
          },
        },
      },
    });

    if (!user) {
      return notFoundError("User not found");
    }

    const profile = { ...user };
    delete (profile as { passwordHash?: string }).passwordHash;

    return apiSuccess({ profile });
  } catch (error) {
    return serverError(error, "Error fetching user profile");
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: parsed.data,
      include: {
        attributes: true,
      },
    });

    const profile = { ...updatedUser };
    delete (profile as { passwordHash?: string }).passwordHash;

    return apiSuccess({ profile }, "Profile updated successfully");
  } catch (error) {
    return serverError(error, "Error updating user profile");
  }
}

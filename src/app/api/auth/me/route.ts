import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getSessionUser, AUTH_COOKIE_NAME } from "@/lib/auth";
import {
  apiSuccess,
  unauthorizedError,
  notFoundError,
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
      },
    });

    if (!user) {
      return notFoundError("User not found");
    }

    const userData = { ...user };
    delete (userData as { passwordHash?: string }).passwordHash;

    return apiSuccess({ user: userData });
  } catch (error) {
    return serverError(error, "Error fetching me");
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    return apiSuccess({}, "Logged out successfully");
  } catch (error) {
    return serverError(error, "Error logging out");
  }
}

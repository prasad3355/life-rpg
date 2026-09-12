import { db } from "@/lib/db";
import { getSessionUser, comparePassword, hashPassword } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations/auth";
import {
  apiSuccess,
  apiError,
  unauthorizedError,
  notFoundError,
  validationError,
  serverError,
} from "@/lib/api";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return notFoundError("User not found");
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);

    if (!isMatch) {
      return apiError("Current password is incorrect", 400);
    }

    const newPasswordHash = await hashPassword(newPassword);

    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        text: "Changed security passphrase",
      },
    });

    return apiSuccess({}, "Password updated successfully");
  } catch (error) {
    return serverError(error, "Failed to change password");
  }
}

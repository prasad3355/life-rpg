import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { comparePassword, signToken, getAuthCookieOptions } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import {
  apiSuccess,
  unauthorizedError,
  validationError,
  serverError,
} from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email },
      include: { attributes: true },
    });

    if (!user) {
      return unauthorizedError("Invalid email or password");
    }

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
      return unauthorizedError("Invalid email or password");
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const cookieStore = await cookies();
    const cookieOptions = getAuthCookieOptions();
    cookieStore.set(cookieOptions.name, token, cookieOptions);

    const userData = { ...user };
    delete (userData as { passwordHash?: string }).passwordHash;

    return apiSuccess({ user: userData, token }, "Login successful");
  } catch (error) {
    return serverError(error, "Error logging in");
  }
}

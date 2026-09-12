import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { hashPassword, signToken, getAuthCookieOptions } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";
import {
  apiSuccess,
  apiError,
  validationError,
  serverError,
} from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { username, email, password } = parsed.data;

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return apiError(`${field} is already in use`, 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        username,
        email,
        passwordHash,
        attributes: {
          create: [
            { name: "Strength", value: 10, max: 100 },
            { name: "Intellect", value: 10, max: 100 },
            { name: "Discipline", value: 10, max: 100 },
            { name: "Focus", value: 10, max: 100 },
            { name: "Vitality", value: 10, max: 100 },
          ],
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        level: true,
        xp: true,
        xpToNextLevel: true,
        gold: true,
        streakDays: true,
        createdAt: true,
        attributes: true,
      },
    });

    const token = signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const cookieStore = await cookies();
    const cookieOptions = getAuthCookieOptions();
    cookieStore.set(cookieOptions.name, token, cookieOptions);

    return apiSuccess(
      { user, token },
      "Registration successful",
      201
    );
  } catch (error) {
    return serverError(error, "Error registering user");
  }
}

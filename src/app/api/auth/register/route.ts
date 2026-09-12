import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { hashPassword, signToken, getAuthCookieOptions } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return NextResponse.json(
        { error: `${field} is already in use` },
        { status: 409 }
      );
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

    return NextResponse.json(
      { message: "Registration successful", user, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

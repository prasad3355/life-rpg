import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { comparePassword, signToken, getAuthCookieOptions } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email },
      include: { attributes: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
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

    return NextResponse.json(
      { message: "Login successful", user: userData, token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

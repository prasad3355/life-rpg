import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations/auth";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = { ...user };
    delete (profile as { passwordHash?: string }).passwordHash;

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
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

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

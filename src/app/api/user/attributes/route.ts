import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createAttributeSchema } from "@/lib/validations/attribute";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attributes = await db.attribute.findMany({
      where: { userId: session.userId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ attributes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createAttributeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, value, max } = parsed.data;

    const existing = await db.attribute.findUnique({
      where: {
        userId_name: {
          userId: session.userId,
          name,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Attribute '${name}' already exists` },
        { status: 409 }
      );
    }

    const attribute = await db.attribute.create({
      data: {
        userId: session.userId,
        name,
        value,
        max,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.userId,
        text: `Unlocked attribute '${attribute.name}'`,
      },
    });

    return NextResponse.json({ attribute }, { status: 201 });
  } catch (error) {
    console.error("Error creating attribute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

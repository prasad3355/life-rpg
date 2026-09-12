import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createQuestSchema } from "@/lib/validations/quest";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const whereClause: {
      userId: string;
      status?: string;
      category?: string;
    } = {
      userId: session.userId,
    };

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const quests = await db.quest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quests:", error);
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
    const parsed = createQuestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const quest = await db.quest.create({
      data: {
        ...parsed.data,
        userId: session.userId,
      },
    });

    await db.activityLog.create({
      data: {
        userId: session.userId,
        text: `Created new quest '${quest.title}'`,
      },
    });

    return NextResponse.json({ quest }, { status: 201 });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

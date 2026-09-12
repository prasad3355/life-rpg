import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateQuestSchema } from "@/lib/validations/quest";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Quest ID is required" }, { status: 400 });
    }

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    if (quest.userId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this quest" },
        { status: 403 }
      );
    }

    return NextResponse.json({ quest }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Quest ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateQuestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    if (quest.userId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this quest" },
        { status: 403 }
      );
    }

    const updatedQuest = await db.quest.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ quest: updatedQuest }, { status: 200 });
  } catch (error) {
    console.error("Error updating quest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Quest ID is required" }, { status: 400 });
    }

    const quest = await db.quest.findUnique({
      where: { id },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    if (quest.userId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this quest" },
        { status: 403 }
      );
    }

    await db.quest.delete({
      where: { id },
    });

    await db.activityLog.create({
      data: {
        userId: session.userId,
        text: `Deleted quest '${quest.title}'`,
      },
    });

    return NextResponse.json(
      { message: "Quest deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

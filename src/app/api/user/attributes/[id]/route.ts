import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { updateAttributeSchema } from "@/lib/validations/attribute";

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
      return NextResponse.json(
        { error: "Attribute ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = updateAttributeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const attribute = await db.attribute.findUnique({
      where: { id },
    });

    if (!attribute) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    if (attribute.userId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this attribute" },
        { status: 403 }
      );
    }

    const updatedAttribute = await db.attribute.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ attribute: updatedAttribute }, { status: 200 });
  } catch (error) {
    console.error("Error updating attribute:", error);
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
      return NextResponse.json(
        { error: "Attribute ID is required" },
        { status: 400 }
      );
    }

    const attribute = await db.attribute.findUnique({
      where: { id },
    });

    if (!attribute) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    if (attribute.userId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this attribute" },
        { status: 403 }
      );
    }

    await db.attribute.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Attribute deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting attribute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createAttributeSchema } from "@/lib/validations/attribute";
import {
  apiSuccess,
  apiError,
  unauthorizedError,
  validationError,
  serverError,
} from "@/lib/api";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const attributes = await db.attribute.findMany({
      where: { userId: session.userId },
      orderBy: { name: "asc" },
    });

    return apiSuccess({ attributes });
  } catch (error) {
    return serverError(error, "Error fetching attributes");
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return unauthorizedError();
    }

    const body = await req.json();
    const parsed = createAttributeSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
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
      return apiError(`Attribute '${name}' already exists`, 409);
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

    return apiSuccess({ attribute }, "Attribute created successfully", 201);
  } catch (error) {
    return serverError(error, "Error creating attribute");
  }
}


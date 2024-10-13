import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, units } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await auth();
        const {title} = await req.json();

        if(!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.query.courses.findFirst({
            where: eq(courses.id, params.courseId),
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unitsList = await db.query.units.findMany({
            where: eq(units.courseId, params.courseId),
            orderBy: asc(units.order),
        });

        const lastUnit = unitsList[unitsList.length - 1];

        const newOrder = lastUnit ? lastUnit.order + 1 : 1;

        const unit = await db.insert(units).values({
            id: createId(),
            title,
            courseId: params.courseId,
            order: newOrder,
        }).returning();

        return NextResponse.json(unit);
    } catch (error) {
        console.log("[UNITS]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, lessons, units } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string, unitId: string } }
) {
    try {
        const session = await auth();
        const {title} = await req.json();

        if(!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.query.courses.findFirst({
            where: eq(courses.id, params.courseId),
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unitExists = await db.query.units.findFirst({
            where: eq(units.id, params.unitId),
        });

        if (!unitExists) {
            return new NextResponse("Unit not found", { status: 404 });
        }

        const lessonsList = await db.query.lessons.findMany({
            where: eq(lessons.unitId, params.unitId),
            orderBy: asc(lessons.order),
        });

        const lastLesson = lessonsList[lessonsList.length - 1];

        const newOrder = lastLesson ? lastLesson.order + 1 : 1;

        const lesson = await db.insert(lessons).values({
            id: createId(),
            title,
            unitId: params.unitId,
            order: newOrder,
        }).returning();

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[LESSONS]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
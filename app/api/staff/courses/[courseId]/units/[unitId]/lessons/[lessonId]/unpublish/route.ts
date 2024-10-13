import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, lessons } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string } }
) {
    try {
        const session = await auth();
        const { isPublished, ...values } = await req.json();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.query.courses.findFirst({
            where: eq(courses.id, params.courseId),
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unit = await db.query.units.findFirst({
            where: (units, { eq }) => eq(units.id, params.unitId)
        })

        if (!unit) {
            return new NextResponse("Unit not found", { status: 400 });
        }


        const lesson = await db.query.lessons.findFirst({
            where: eq(lessons.id, params.lessonId),
        })

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        const unPublishedLesson = await db.update(lessons).set(values)
            .where(and(
                eq(courses.id, params.courseId),
                eq(lessons.unitId, params.unitId),
                eq(lessons.id, params.lessonId)
            ))
            .returning();

        return NextResponse.json(unPublishedLesson);
    } catch (error) {
        console.log("[LESSON_ID_UNPUBLISH]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
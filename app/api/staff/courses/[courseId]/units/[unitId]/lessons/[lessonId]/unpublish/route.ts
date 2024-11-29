import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, lessons, units } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.query.courses.findFirst({
            where: eq(courses.id, params.courseId),
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unit = await db.query.units.findFirst({
            where: and(
                eq(units.id, params.unitId),
                eq(units.courseId, params.courseId)
            ),
        })

        if (!unit) {
            return new NextResponse("Unit not found", { status: 400 });
        }


        const lesson = await db.query.lessons.findFirst({
            where: and(
                eq(lessons.id, params.lessonId),
                eq(lessons.unitId, params.unitId),
            ),
        })

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        const unPublishedLesson = await db.update(lessons)
            .set({ isPublished: false })
            .where(and(
                eq(lessons.id, params.lessonId),
                eq(lessons.unitId, params.unitId)
            ))

        return NextResponse.json(unPublishedLesson);
    } catch (error) {
        console.log("[LESSON_ID_UNPUBLISH]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
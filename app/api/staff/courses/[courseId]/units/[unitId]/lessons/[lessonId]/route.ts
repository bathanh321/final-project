import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, units, lessons } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
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
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unitExists = await db.query.units.findFirst({
            where: and(
                eq(units.id, params.unitId),
                eq(units.courseId, params.courseId)
            ),
        });

        if (!unitExists) {
            return new NextResponse("Unit not found", { status: 404 });
        }

        const lessonExists = await db.query.lessons.findFirst({
            where: and(
                eq(lessons.id, params.lessonId),
                eq(lessons.unitId, params.unitId)
            ),
        });

        if (!lessonExists) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        const deletedLesson = await db.delete(lessons)
        .where(and(
            eq(lessons.unitId, params.unitId),
            eq(lessons.id, params.lessonId)
        )
        );

        return NextResponse.json(deletedLesson);
    } catch (error) {
        console.log("[LESSON_ID_DELETE]", error);
        return new NextResponse("Internal server error", { status: 500 });
        
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string } }
) {
    try {
        const session = await auth();
        const { ...values } = await req.json();

        if (!session?.user) {
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

        const lesson = await db.update(lessons).set(values)
            .where(eq(lessons.id, params.lessonId))
            .returning();

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[LESSON_ID]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
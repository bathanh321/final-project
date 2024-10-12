import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, lessons, units } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: number, unitId: number } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.query.courses.findFirst({
            where: (courses, { eq }) => eq(courses.id, params.courseId)
        })

        if (!course) {
            return new NextResponse("Course not found", { status: 400 });
        }

        const data = await db
            .select({
                id: units.id,
                title: units.title,
                description: units.description,
                isPublished: units.isPublished,
                order: units.order,
                lessonId: lessons.id,
                lessonTitle: lessons.title,
                lessonIsPublished: lessons.isPublished,
                lessonOrder: lessons.order,
            })
            .from(units)
            .leftJoin(lessons, eq(units.id, lessons.unitId))
            .where(and(
                eq(units.id, params.unitId),
                eq(units.courseId, params.courseId)
            ))
            .orderBy(asc(lessons.order))
            .execute();

        const unit = {
            id: data[0].id ?? 0,
            title: data[0].title ?? "",
            description: data[0].description ?? "",
            isPublished: data[0].isPublished ?? false,
            order: data[0].order ?? 0,
            lessons: data.map(row => ({
                id: row.lessonId ?? 0,
                title: row.lessonTitle ?? "",
                isPublished: row.lessonIsPublished ?? false,
                order: row.lessonOrder ?? 0,
            }))
        }

        const hasPublishedLessons = unit.lessons.some((lesson) => lesson.isPublished);

        if (!unit.title || !unit.description || !hasPublishedLessons) {
            return new NextResponse("Missing require fields", { status: 400 });
        }

        const publishedUnit = await db.update(units)
        .set({ isPublished: true })
        .where(and(
            eq(units.id, params.unitId),
            eq(units.courseId, params.courseId)
        ))

        return NextResponse.json(publishedUnit);
    } catch (error) {
        console.log("[UNIT_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
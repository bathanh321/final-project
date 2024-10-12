import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: number } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await db
            .select({
                courseId: courses.id,
                courseTitle: courses.title,
                courseImageSrc: courses.imageSrc,
                courseIsPublished: courses.isPublished,
                unitId: units.id,
                unitTitle: units.title,
                unitDescription: units.description,
                unitIsPublished: units.isPublished,
                unitOrder: units.order,
            })
            .from(courses)
            .leftJoin(units, eq(courses.id, units.courseId))
            .where(eq(courses.id, params.courseId))
            .execute();

        const course = {
            id: data[0].courseId,
            title: data[0].courseTitle,
            imageSrc: data[0].courseImageSrc,
            isPublished: data[0].courseIsPublished,
            units: data.map(row => ({
                id: row.unitId,
                title: row.unitTitle,
                description: row.unitDescription,
                isPublished: row.unitIsPublished,
                order: row.unitOrder,
            })).filter(unit => unit.id !== null)
        };

        const hasPublishedUnits = course.units.some((unit) => unit.isPublished);

        if (!course.title || !course.imageSrc || !hasPublishedUnits) {
            return new NextResponse("Missing require fields", { status: 400 });
        }

        const publishedCourse = await db.update(courses)
        .set({ isPublished: true })
        .where(eq(courses.id, params.courseId))

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
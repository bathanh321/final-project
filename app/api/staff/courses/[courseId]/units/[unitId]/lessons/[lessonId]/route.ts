import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, units, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: number; unitId: number; lessonId: number } }
) {
    try {
        const session = await auth();
        const { isPublished, ...values } = await req.json();

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
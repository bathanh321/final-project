import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
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

        const unPublishedCourse = await db.update(courses)
        .set({ isPublished: false })
        .where(eq(courses.id, params.courseId))

        return NextResponse.json(unPublishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
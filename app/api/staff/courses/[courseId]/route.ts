import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { courseId: string } }
) => {
    try {
        const session = await auth()

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;
        const values = await req.json();

        const courseIdNumber = Number(courseId);

        if (isNaN(courseIdNumber)) {
            return new NextResponse("Invalid course ID", { status: 400 });
        }

        const course = await db.update(courses).set(values)
            .where(eq(courses.id, courseIdNumber))
            .returning();

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
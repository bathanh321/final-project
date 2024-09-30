import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: number; unitId: number } }
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

        const unit = await db.update(units).set(values)
            .where(eq(units.id, params.unitId))
            .returning();

        return NextResponse.json(unit);
    } catch (error) {
        console.log("[COURSE_UNIT_ID]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
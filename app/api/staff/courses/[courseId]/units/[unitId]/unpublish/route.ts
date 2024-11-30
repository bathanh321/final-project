import { auth } from "@/auth";
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string, unitId: string } }
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

        const unit = await db.query.units.findFirst({
            where: (units, { eq }) => eq(units.id, params.unitId)
        })

        if (!unit) {
            return new NextResponse("Unit not found", { status: 400 });
        }

        const unPublishedUnit = await db.update(units)
        .set({ isPublished: false })
        .where(and(
            eq(units.id, params.unitId),
            eq(units.courseId, params.courseId)
        ))

        return NextResponse.json(unPublishedUnit);
    } catch (error) {
        console.log("[UNIT_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
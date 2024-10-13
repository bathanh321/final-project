import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, lessons, units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; unitId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();

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

        for (let item of list) {
            await db.update(lessons).set({
                order: item.order
            })
            .where(eq(lessons.id, item.id));
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER_LESSONS]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
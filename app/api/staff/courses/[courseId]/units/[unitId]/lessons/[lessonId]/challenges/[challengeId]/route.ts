import { auth } from "@/auth";
import db from "@/db/drizzle";
import { challenges, courses, lessons, units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string, challengeId: string } }
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

        const lessonExists = await db.query.lessons.findFirst({
            where: eq(lessons.id, params.lessonId),
        })

        if (!lessonExists) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        const challenge = await db.update(challenges).set(values)
            .where(eq(challenges.id, params.challengeId))
            .returning();

        return NextResponse.json(challenge);
    } catch (error) {
        console.log("[CHALLENGE_ID]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
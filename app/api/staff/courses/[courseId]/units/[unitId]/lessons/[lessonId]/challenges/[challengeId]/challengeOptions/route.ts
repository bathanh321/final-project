import { auth } from "@/auth";
import db from "@/db/drizzle";
import { challengeOptions, challenges, courses, lessons, units } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string; challengeId: string; }; },
) {
    try {
        const session = await auth();
        const { text, correct, imageSrc, audioSrc } = await req.json();

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
            where: eq(units.id, params.unitId),
        });

        if (!unitExists) {
            return new NextResponse("Unit not found", { status: 404 });
        }

        const lessonExists = await db.query.lessons.findFirst({
            where: eq(lessons.id, params.lessonId),
        });

        if (!lessonExists) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        const challengeExists = await db.query.challenges.findFirst({
            where: eq(challenges.id, params.challengeId),
        });

        if (!challengeExists) {
            return new NextResponse("Challenge not found", { status: 404 });
        }

        const challengeOption = await db.insert(challengeOptions).values({
            id: createId(),
            text,
            correct,
            imageSrc,
            audioSrc,
            challengeId: params.challengeId,
        }).returning();

        return NextResponse.json(challengeOption);
    } catch (error) {
        console.log("[CHALLENGE_OPTIONS]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
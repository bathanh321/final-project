import { auth } from "@/auth";
import db from "@/db/drizzle";
import { challenges, courses, lessons, units } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string; }; },
) {
    try {
        const session = await auth();
        const { question, type, difficultLevel } = await req.json();

        if (!session) {
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

        const challengesList = await db.query.challenges.findMany({
            where: eq(challenges.lessonId, params.lessonId),
            orderBy: asc(challenges.order),
        });

        const lastChallenge = challengesList[challengesList.length - 1];

        const newOrder = lastChallenge ? lastChallenge.order + 1 : 1;

        const challenge = await db.insert(challenges).values({
            id: createId(),
            question,
            type,
            difficultLevel,
            lessonId: params.lessonId,
            order: newOrder,
        }).returning();

        return NextResponse.json(challenge);
    } catch (error) {
        console.log("[CHALLENGES]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
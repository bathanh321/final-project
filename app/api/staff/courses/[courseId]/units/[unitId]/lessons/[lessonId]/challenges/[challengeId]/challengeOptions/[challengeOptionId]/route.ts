import { auth } from "@/auth";
import db from "@/db/drizzle";
import { challengeOptions, challenges, courses, lessons, units } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            courseId: string,
            unitId: string,
            lessonId: string,
            challengeId: string,
            challengeOptionId: string
        }
    }
) {
    try {
        const session = await auth();
        const values = await req.json();

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
        })

        if (!lessonExists) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        const challengeExists = await db.query.challenges.findFirst({
            where: eq(challenges.id, params.challengeId),
        });

        if (!challengeExists) {
            return new NextResponse("Challenge not found", { status: 404 });
        }

        if (values.correct) {
            const existingCorrectOption = await db.query.challengeOptions.findFirst({
                where: and(
                    eq(challengeOptions.challengeId, params.challengeId),
                    eq(challengeOptions.correct, true)
                )
            })

            if (existingCorrectOption) {
                await db.update(challengeOptions)
                    .set({ correct: false })
                    .where(eq(challengeOptions.id, existingCorrectOption.id))
            }
        }

        const challengeOption = await db.update(challengeOptions).set(values)
            .where(eq(challengeOptions.id, params.challengeOptionId))
            .returning();

        return NextResponse.json(challengeOption);
    } catch (error) {
        console.log("[CHALLENGE_OPTIONS_ID]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
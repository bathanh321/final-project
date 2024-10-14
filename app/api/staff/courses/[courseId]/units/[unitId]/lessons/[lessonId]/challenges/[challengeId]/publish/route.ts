import { auth } from "@/auth";
import db from "@/db/drizzle";
import { NextResponse } from "next/server";
import { challengeOptions, challenges, courses, lessons, units } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            courseId: string;
            unitId: string;
            lessonId: string;
            challengeId: string;
        }
    }
) {
    try {
        const session = await auth();

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
            return new NextResponse("Course not found", { status: 400 });
        }

        const unitExists = await db.query.units.findFirst({
            where: and(
                eq(units.id, params.unitId),
                eq(units.courseId, params.courseId)
            ),
        });

        if (!unitExists) {
            return new NextResponse("Unit not found", { status: 400 });
        }

        const lessonExists = await db.query.lessons.findFirst({
            where: and(
                eq(lessons.id, params.lessonId),
                eq(lessons.unitId, params.unitId)
            ),
        });

        if (!lessonExists) {
            return new NextResponse("Lesson not found", { status: 400 });
        }

        const data = await db
        .select({
            id: challenges.id,
            type: challenges.type,
            question: challenges.question,
            difficultLevel: challenges.difficultLevel,
            isPublished: challenges.isPublished,
            order: challenges.order,
            challengeOptionsId: challengeOptions.id,
            challengeOptionsText: challengeOptions.text,
            challengeOptionsCorrect: challengeOptions.correct,
            challengeOptionsImageSrc: challengeOptions.imageSrc,
            challengeOptionsAudioSrc: challengeOptions.audioSrc,
        })
        .from(challenges)
        .leftJoin(challengeOptions, eq(challenges.id, challengeOptions.challengeId))
        .where(and(
            eq(challenges.id, params.challengeId),
            eq(challenges.lessonId, params.lessonId)
        ))
        .execute();

        const challenge = {
            id: data[0].id ?? 0,
            type: data[0].type ?? "",
            question: data[0].question ?? "",
            difficultLevel: data[0].difficultLevel ?? 0,
            isPublished: data[0].isPublished ?? false,
            order: data[0].order ?? 0,
            challengeOptions: data.map(row => ({
                id: row.challengeOptionsId ?? 0,
                text: row.challengeOptionsText ?? "",
                correct: row.challengeOptionsCorrect ?? false,
                imageSrc: row.challengeOptionsImageSrc ?? "",
                audioSrc: row.challengeOptionsAudioSrc ?? "",
            }))
        }

        const hasLeastTwoOption = challenge.challengeOptions.length >= 2;

        if(!hasLeastTwoOption) {
            return new NextResponse("At least two options are required", { status: 400 });
        }

        const hasCorrectOption = challenge.challengeOptions.some((option) => option.correct);

        if (!hasCorrectOption) {
            return new NextResponse("Correct option is required", { status: 400 });
        }

        const publishedChallenge = await db.update(challenges)
        .set({ isPublished: true })
        .where(and(
            eq(challenges.id, params.challengeId),
            eq(challenges.lessonId, params.lessonId)
        ));

        return NextResponse.json(publishedChallenge);
    } catch (error) {
        console.log("[CHALLENGE_ID_PUBLISH]", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}
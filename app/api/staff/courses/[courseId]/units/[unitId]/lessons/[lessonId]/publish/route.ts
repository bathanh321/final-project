import { auth } from "@/auth";
import db from "@/db/drizzle";
import { challenges, courses, lessons, units } from "@/db/schema";
import { and, asc, eq, is } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string } }
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
        })

        if (!courseOwner) {
            return new NextResponse("Course not found", { status: 400 });
        }

        const data = await db
            .select({
                id: lessons.id,
                title: lessons.title,
                isPublished: lessons.isPublished,
                order: lessons.order,
                challengeId: challenges.id,
                challengeType: challenges.type,
                challengeQuestion: challenges.question,
                challengeDifficultLevel: challenges.difficultLevel,
                challengeIsPublished: challenges.isPublished,
                challengeOrder: challenges.order,
            })
            .from(lessons)
            .leftJoin(challenges, eq(lessons.id, challenges.lessonId))
            .where(and(
                eq(lessons.id, params.lessonId),
                eq(lessons.unitId, params.unitId)
            ))
            .orderBy(asc(challenges.order))
            .execute();

        const lesson = {
            id: data[0].id ?? 0,
            title: data[0].title ?? "",
            isPublished: data[0].isPublished ?? false,
            order: data[0].order ?? 0,
            challenges: data.map(row => ({
                id: row.challengeId ?? 0,
                type: row.challengeType ?? "",
                question: row.challengeQuestion ?? "",
                difficultLevel: row.challengeDifficultLevel ?? "",
                isPublished: row.challengeIsPublished ?? false,
                order: row.challengeOrder ?? 0,
            }))
        }

        const hasPublishChallenges = lesson.challenges.some((challenge) => challenge.isPublished);

        if (!lesson.title || !hasPublishChallenges) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedLesson = await db.update(lessons)
        .set({ isPublished: true })
        .where(and(
            eq(courses.id, params.courseId),
            eq(lessons.id, params.lessonId),
            eq(lessons.unitId, params.unitId)
        ));
    } catch (error) {
        console.log("[LESSON_ID_PUBLISH]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
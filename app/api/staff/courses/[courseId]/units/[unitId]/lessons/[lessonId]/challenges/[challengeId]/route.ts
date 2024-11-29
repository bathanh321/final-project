import { auth } from "@/auth";
import db from "@/db/drizzle";
import { challenges, courses, lessons, units } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; unitId: string; lessonId: string, challengeId: string } }
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
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unitExists = await db.query.units.findFirst({
            where: and(
                eq(units.id, params.unitId),
                eq(units.courseId, params.courseId)
            ),
        });

        if (!unitExists) {
            return new NextResponse("Unit not found", { status: 404 });
        }

        const lessonExists = await db.query.lessons.findFirst({
            where: and(
                eq(lessons.id, params.lessonId),
                eq(lessons.unitId, params.unitId)
            ),
        })

        if (!lessonExists) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        const challengeExists = await db.query.challenges.findFirst({
            where: and(
                eq(challenges.id, params.challengeId),
                eq(challenges.lessonId, params.lessonId)
            )
        })

        if (!challengeExists) {
            return new NextResponse("Challenge not found", { status: 404 });
        }

        const deletedChallenge = await db.delete(challenges)
        .where(and(
            eq(challenges.lessonId, params.lessonId),
            eq(challenges.id, params.challengeId)
        ))

        return NextResponse.json(deletedChallenge);
    } catch (error) {
        console.log("[CHALLENGE_ID_DELETE]", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}

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
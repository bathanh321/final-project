"use server"

import { auth } from "@/auth"
import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: string) => {
    const session = await auth();

    const user = await currentUser();

    if (!session?.user.id || !user) {
        throw new Error("Unauthorized");
    }

    const course = await getCourseById(courseId);

    if (!course) {
        throw new Error("Course not found");
    }

    const existingUserProgress = await getUserProgress();

    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: session.user.name || "",
            userImageSrc: session.user.image || "/mascot.svg",
        });

        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId: session.user.id,
        activeCourseId: courseId,
        userName: session.user.name || "",
        userImageSrc: session.user.image || "/mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
}

export const reduceHearts = async (challengeId: string) => {
    const session = await auth();

    if (!session?.user.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const currentUserProgress = await getUserProgress();

    const challenge = await db.query.challenges.findFirst({
        where: and(
            eq(challenges.id, challengeId),
            eq(challenges.isPublished, true)
        )
    })

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        )
    });

    const isPractice = !!existingChallengeProgress;

    if (isPractice) {
        return { error: "practice" };
    }

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if (currentUserProgress.hearts === 0) {
        return { error: "hearts" };
    }

    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
        .where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if (currentUserProgress.hearts === 5) {
        throw new Error("Hearts are already full");
    }

    if (currentUserProgress.points < 50) {
        throw new Error("Not enough points");
    }

    await db.update(userProgress).set({
        hearts: 5,
        points: currentUserProgress.points - 50,
    }).where(eq(userProgress.userId, currentUserProgress.userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
}
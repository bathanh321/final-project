import { cache } from "react"
import db from "./drizzle"
import { and, eq } from "drizzle-orm";
import { challengeProgress, challenges, courses, lessons, units, userProgress } from "./schema";
import { auth } from "@/auth";

export const getUserProgress = cache(async () => {
    const session = await auth();

    if (!session?.user.id) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, session.user.id),
        with: {
            activeCourse: true,
        }
    })

    return data;
});

export const getUnits = cache(async () => {
    const session = await auth();
    const userProgress = await getUserProgress();

    if (!session?.user.id || !userProgress?.activeCourse) {
        return [];
    }

    const data = db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: and(
            eq(units.courseId, userProgress.activeCourse.id),
            eq(units.isPublished, true)
        ),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                where: eq(lessons.isPublished, true),
                with: {
                    challenges: {
                        orderBy: (challenges, { asc }) => [asc(challenges.order)],
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, session.user.id)
                            },
                        }
                    }
                }
            }
        }
    });

    const normalizedData = (await data).map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            if (lesson.challenges.length === 0) {
                return { ...lesson, completed: false }
            }

            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress
                    && challenge.challengeProgress.length > 0
                    && challenge.challengeProgress.every((progress) => progress.completed)
            });

            return { ...lesson, completed: allCompletedChallenges }
        });
        return { ...unit, lessons: lessonsWithCompletedStatus }
    });

    return normalizedData;
})

export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany({
        where: eq(courses.isPublished, true),
    })

    return data;
})

export const getCourseById = cache(async (courseId: string) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            units: {
                orderBy: (units, { asc }) => [asc(units.order)],
                with: {
                    lessons: {
                        orderBy: (lessons, {asc}) => [asc(lessons.order)],
                    }
                }
            }
        }
    })

    return data;
})

export const getCourseProgress = cache(async () => {
    const session = await auth();
    const userProgress = await getUserProgress();

    if (!session?.user.id || !userProgress?.activeCourseId) {
        return null;
    }

    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: and(
            eq(units.isPublished, true),
            eq(units.courseId, userProgress.activeCourseId)
        ),
        with: {
            lessons: {
                where: eq(lessons.isPublished, true),
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        where: eq(challenges.isPublished, true),
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, session.user.id)
                            },
                        },
                    },
                },
            },
        },
    });

    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap((unit) => unit.lessons)
        .find((lesson) => {
            return lesson.challenges.some((challenge) => {
                return !challenge.challengeProgress 
                || challenge.challengeProgress.length === 0
                || challenge.challengeProgress.some((progress) => progress.completed === false);
            });
        });

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    }
});

export const getLesson = cache(async (id?: string) => {
    const session = await auth();

    if (!session?.user.id) {
        return null;
    }

    const courseProgress = await getCourseProgress();

    const lessonId = id || courseProgress?.activeLessonId;

    if (!lessonId) {
        return null;
    }

    const data = await db.query.lessons.findFirst({
        where: and(
            eq(lessons.isPublished, true),
            eq(lessons.id, lessonId)
        ),
        with: {
            challenges: {
                where: eq(challenges.isPublished, true),
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, session.user.id)
                    },
                },
            },
        },
    });

    if(!data || !data.challenges) {
        return null;
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress
         && challenge.challengeProgress.length > 0
         && challenge.challengeProgress.every((progress) => progress.completed);

        return {
            ...challenge,
            completed,
        }
    });

    // Group challenges by difficulty level
    const groupedChallenges = normalizedChallenges.reduce((acc, challenge) => {
        const { difficultLevel } = challenge;
        if (difficultLevel == null) {
            return acc; 
        }
        if (!acc[difficultLevel]) {
            acc[difficultLevel] = [];
        }
        acc[difficultLevel].push(challenge);
        return acc;
    }, {} as Record<number, typeof normalizedChallenges>);

    
    const selectedChallenges = [];
    for (const level in groupedChallenges) {
        const challenges = groupedChallenges[level];
        const shuffled = challenges.sort(() => 0.5 - Math.random());
        selectedChallenges.push(...shuffled.slice(0, 2));
    }

    return {
        ...data,
        challenges: selectedChallenges,
    }
});

export const getLessonPercentage = cache(async () => {
    const courseProgress = await getCourseProgress();

    if (!courseProgress?.activeLessonId) {
        return 0;
    }

    const lesson = await getLesson(courseProgress.activeLessonId);

    if (!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges
    .filter((challenge) => challenge.completed);

    const percentage = Math.round(
        (completedChallenges.length / lesson.challenges.length) * 100
    );

    return percentage;
})
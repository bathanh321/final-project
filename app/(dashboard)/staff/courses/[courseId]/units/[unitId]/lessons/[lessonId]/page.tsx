import { auth } from "@/auth";
import { IconBadge } from "@/components/icon-badge";
import db from "@/db/drizzle";
import { challenges, lessons } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LessonTitleForm } from "./lesson-title-form";
import { ChallengesForm } from "./challenges-form";

interface LessonIdPageProps {
    params: {
        courseId: number;
        unitId: number;
        lessonId: number;
    };
}

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
    const user = auth();

    if (!user) {
        return redirect("/auth/login")
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

    if(data.length === 0) {
        return (
            <div>Lesson not found</div>
        )
    }

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

    const requiredFields = [
        lesson.title,
        lesson.challenges.some((challenge) => challenge.isPublished)
    ]

    const totalFields = requiredFields.length;
    const completionText = `${requiredFields.filter(Boolean).length}/${totalFields}`;


    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/staff/courses/${params.courseId}/units/${params.unitId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to unit setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Lesson creation
                            </h1>
                            <span className="text-sm text-muted-foreground">
                                Complete all fields {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your unit
                        </h2>
                    </div>
                    <LessonTitleForm
                        initialData={lesson}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">
                                Lesson Challenge
                            </h2>
                        </div>
                        <ChallengesForm
                            initialData={lesson}
                            lessonId={params.lessonId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonIdPage
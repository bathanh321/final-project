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
import { Actions } from "./actions";

interface LessonIdPageProps {
    params: {
        courseId: string;
        unitId: string;
        lessonId: string;
    };
}

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
    const user = await auth();

    if (!user || user.user.role === "USER") {
        return redirect("/")
    }

    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, params.lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)]
            }
        }
    })

    if (!lesson) {
        return redirect("/auth/login");
    }

    const requiredFields = [
        lesson.title,
        lesson.challenges.some((challenge) => challenge.isPublished)
    ]

    const totalFields = requiredFields.length;
    const completionText = `${requiredFields.filter(Boolean).length}/${totalFields}`;

    const isCompleted = requiredFields.every(Boolean);

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
                        <Actions
                            disabled={!isCompleted}
                            courseId={params.courseId}
                            unitId={params.unitId}
                            lessonId={params.lessonId}
                            isPublished={lesson.isPublished}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your lesson
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
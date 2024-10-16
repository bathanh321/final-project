import { auth } from "@/auth";
import { IconBadge } from "@/components/icon-badge";
import db from "@/db/drizzle";
import { challengeOptions, challenges } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChallengeTypeForm } from "./challenge-type-form";
import { ChallengeQuestionForm } from "./challenge-question-form";
import { ChallengeDifficultLevelForm } from "./challenge-difficult-level-form";
import { ChallengeOptionsForm } from "./challenge-options-form";
import { Actions } from "./actions";

interface ChallengeIdPageProps {
    params: {
        courseId: string;
        unitId: string;
        lessonId: string;
        challengeId: string;
    };
}

const ChallengeIdPage = async ({ params }: ChallengeIdPageProps) => {
    const user = auth();

    if (!user) {
        return redirect("/auth/login")
    }

    const challenge = await db.query.challenges.findFirst({
        where: and(
            eq(challenges.id, params.challengeId),
            eq(challenges.lessonId, params.lessonId),
        ),
        with: {
            challengeOptions: {
                orderBy: (challengeOptions, { asc }) => [asc(challengeOptions.correct)]
            }
        }
    })

    if (!challenge) {
        return redirect("/auth/login");
    }

    const hasCorrectOption = challenge.challengeOptions.some(option => option.correct);

    const requiredFields = [
        challenge.type,
        challenge.question,
        challenge.difficultLevel,
        challenge.challengeOptions.length >= 2,
        hasCorrectOption
    ]

    const totalFields = requiredFields.length;
    const completionText = `${requiredFields.filter(Boolean).length}/${totalFields}`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/staff/courses/${params.courseId}/units/${params.unitId}/lessons/${params.lessonId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to lesson setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Challenge creation
                            </h1>
                            <span className="text-sm text-muted-foreground">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        <Actions
                            disabled={!requiredFields.every(Boolean)}
                            courseId={params.courseId}
                            unitId={params.unitId}
                            lessonId={params.lessonId}
                            challengeId={params.challengeId}
                            isPublished={challenge.isPublished}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your challenge
                        </h2>
                    </div>
                    <ChallengeTypeForm
                        initialData={challenge}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                        challengeId={params.challengeId}
                    />
                    <ChallengeQuestionForm
                        initialData={challenge}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                        challengeId={params.challengeId}
                    />
                    <ChallengeDifficultLevelForm
                        initialData={challenge}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                        challengeId={params.challengeId}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">
                                Challenge Options
                            </h2>
                        </div>
                        <ChallengeOptionsForm
                            initialData={challenge}
                            courseId={params.courseId}
                            unitId={params.unitId}
                            lessonId={params.lessonId}
                            challengeId={params.challengeId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChallengeIdPage
import { auth } from "@/auth";
import { IconBadge } from "@/components/icon-badge";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, ImageIcon, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChallengeOptionTextForm } from "./challenge-option-text-form";
import { ChallengeOptionImageForm } from "./challenge-option-image-form";
import { ChallengeOptionCorrectForm } from "./challenge-option-correct-form";
import { ChallengeOptionAudioForm } from "./challenge-option-audio-form";

interface ChallengeOptionIdPageProps {
    params: {
        courseId: string;
        unitId: string;
        lessonId: string;
        challengeId: string;
        challengeOptionId: string;
    };
}

const ChallengeOptionIdPage = async ({ params }: ChallengeOptionIdPageProps) => {
    const user = auth();

    if (!user) {
        return redirect("/auth/login")
    }

    const challengeOption = await db.query.challengeOptions.findFirst({
        where: eq(challengeOptions.id, params.challengeOptionId)
    })

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/staff/courses/${params.courseId}/units/${params.unitId}/lessons/${params.lessonId}/challenges/${params.challengeId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to challenge setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Challenge option customization
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your challenge option
                        </h2>
                    </div>
                    <ChallengeOptionTextForm
                        initialData={challengeOption}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                        challengeId={params.challengeId}
                        challengeOptionId={params.challengeOptionId}
                    />
                    <ChallengeOptionCorrectForm
                        initialData={challengeOption}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                        challengeId={params.challengeId}
                        challengeOptionId={params.challengeOptionId}
                    />
                    <ChallengeOptionAudioForm
                        initialData={challengeOption}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                        challengeId={params.challengeId}
                        challengeOptionId={params.challengeOptionId}
                    />
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ImageIcon} />
                        <h2 className="text-xl">
                            Image
                        </h2>
                    </div>
                    <ChallengeOptionImageForm
                        initialData={challengeOption}
                        courseId={params.courseId}
                        unitId={params.unitId}
                        lessonId={params.lessonId}
                        challengeId={params.challengeId}
                        challengeOptionId={params.challengeOptionId}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChallengeOptionIdPage;
import { auth } from "@/auth";
import { IconBadge } from "@/components/icon-badge";
import db from "@/db/drizzle";
import { lessons, units } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UnitTitleForm } from "./unit-title-form";
import { UnitDescriptionForm } from "./unit-description-form";
import { LessonsForm } from "./lessons-form";
import { Actions } from "./actions";


interface UnitIdPageProps {
    params: {
        courseId: string;
        unitId: string;
    };
}

const UnitIdPage = async ({
    params
}: UnitIdPageProps) => {
    const user = await auth();

    if (!user || user.user.role === "USER") {
        return redirect("/auth/login")
    }

    const unit = await db.query.units.findFirst({
        where: eq(units.id, params.unitId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)]
            }
        }
    })

    if (!unit) {
        return redirect("/auth/login");
    }

    const requiredFields = [
        unit.title,
        unit.description,
        unit.lessons.some((lesson) => lesson.isPublished)
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isCompleted = requiredFields.every(Boolean);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/staff/courses/${params.courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to course setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Unit creation
                            </h1>
                            <span className="text-sm text-muted-foreground">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        <Actions
                            disabled={!isCompleted}
                            courseId={params.courseId}
                            unitId={params.unitId}
                            isPublished={unit.isPublished}
                        />
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
                    <UnitTitleForm
                        initialData={unit}
                        courseId={params.courseId}
                        unitId={params.unitId}
                    />
                    <UnitDescriptionForm
                        initialData={unit}
                        courseId={params.courseId}
                        unitId={params.unitId}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">
                                Unit Lessons
                            </h2>
                        </div>
                        <LessonsForm
                            initialData={unit}
                            unitId={unit.id}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnitIdPage;
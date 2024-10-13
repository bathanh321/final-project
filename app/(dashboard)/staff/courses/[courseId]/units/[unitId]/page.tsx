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
    const user = auth();

    if (!user) {
        return redirect("/auth/login")
    }

    const data = await db
        .select({
            id: units.id,
            title: units.title,
            description: units.description,
            isPublished: units.isPublished,
            order: units.order,
            lessonId: lessons.id,
            lessonTitle: lessons.title,
            lessonIsPublished: lessons.isPublished,
            lessonOrder: lessons.order,
        })
        .from(units)
        .leftJoin(lessons, eq(units.id, lessons.unitId))
        .where(and(
            eq(units.id, params.unitId),
            eq(units.courseId, params.courseId)
        ))
        .orderBy(asc(lessons.order))
        .execute();

    if (!data?.length) {
        return redirect("/");
    }

    const unit = {
        id: data[0].id ?? 0,
        title: data[0].title ?? "",
        description: data[0].description ?? "",
        isPublished: data[0].isPublished ?? false,
        order: data[0].order ?? 0,
        lessons: data.map(row => ({
            id: row.lessonId ?? 0,
            title: row.lessonTitle ?? "",
            isPublished: row.lessonIsPublished ?? false,
            order: row.lessonOrder ?? 0,
        }))
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
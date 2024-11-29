

import db from "@/db/drizzle";
import { courses, units } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { redirect, useRouter } from "next/navigation";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "./title-form";
import { ImageForm } from "./image-form";
import { Actions } from "./actions";
import { auth } from "@/auth";
import { UnitsForm } from "./units-form";

interface Unit {
    id: string;
    title: string;
    description: string;
    isPublished: boolean;
    order: number;
}

interface CourseIdPageProps {
    params: {
        courseId: string;
    }
}

const CourseIdPage = async ({
    params,
}: CourseIdPageProps) => {
    const user = await auth();

    if (!user || user.user.role === "USER") {
        return redirect("/");
    }

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, params.courseId),
        with: {
            units: {
                orderBy: (units, { asc }) => [asc(units.order)],
            }
        }
    });

    if (!course) {
        return <div>Course not found</div>;
    }

    const requiredFields = [
        course.title,
        course.imageSrc,
        course.units.some((unit) => unit.isPublished)
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isCompleted = requiredFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner
                    label="This course is unpublished. It will not visible to the students"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <Actions
                        disabled={!isCompleted}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your course
                            </h2>
                        </div>
                        <TitleForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Course units
                                </h2>
                            </div>
                            <UnitsForm
                                initialData={course}
                                courseId={course.id}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseIdPage;
import { auth } from "@/auth";
import { IconBadge } from "@/components/icon-badge";
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UnitTitleForm } from "./unit-title-form";
import { UnitDescriptionForm } from "./unit-description-form";

interface UnitIdPageProps {
    params: {
        courseId: number;
        unitId: number;
    };
}

const UnitIdPage = async ({
    params
}: UnitIdPageProps) => {
    const user = auth();

    if (!user) {
        return redirect("/auth/login")
    }

    const chapter = await db.query.units.findFirst({
        where: and(
            eq(units.id, params.unitId),
            eq(units.courseId, params.courseId)
        )
    })

    if (!chapter) {
        return redirect("/");
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`


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
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard}/>
                        <h2 className="text-xl">
                            Customize your unit
                        </h2>
                    </div>
                    <UnitTitleForm
                        initialData={chapter}
                        courseId={params.courseId}
                        unitId={params.unitId}
                    />
                    <UnitDescriptionForm
                        initialData={chapter}
                        courseId={params.courseId}
                        unitId={params.unitId}
                    />
                </div>
            </div>
        </div>
    );
}

export default UnitIdPage;
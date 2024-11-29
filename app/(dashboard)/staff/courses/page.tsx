import { redirect, useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import db from "@/db/drizzle";
import { auth } from "@/auth";

const CoursePage = async () => {
    const user = await auth();

    if (!user || user.user.role === "USER") {
        return redirect("/");
    }

    const courses = await db.query.courses.findMany()

    return (
        <div className="p-6">

            <DataTable columns={columns} data={courses} />
        </div>
    );
}

export default CoursePage;
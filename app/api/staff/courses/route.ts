import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2"

export const POST = async (req: Request) => {

    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, imageSrc } = await req.json();

        const course = await db.insert(courses).values({
            id: createId(),
            title,
            imageSrc,
        }).returning();
        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
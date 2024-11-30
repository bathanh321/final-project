import { auth } from "@/auth";
import db from "@/db/drizzle";
import { courses, units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();     
        
        const courseOwner = await db.query.courses.findFirst({
            where: eq(courses.id, params.courseId),
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for(const item of list) {
            await db.update(units).set({
                order: item.order
            })
            .where(eq(units.id, item.id))
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
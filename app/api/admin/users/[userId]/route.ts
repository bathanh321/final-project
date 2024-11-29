import { auth } from "@/auth";
import db from "@/db/drizzle";
import { user, UserRole } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { userId: string } }
) => {
    try {
        const session = await auth();

        console.log(session);

        if (session?.user.role !== UserRole.ADMIN) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const userId = params.userId;
        const values = await req.json();

        const userRole = await db.update(user).set(values)
            .where(eq(user.id, userId))
            .returning();

        return NextResponse.json(userRole);
    } catch (error) {
        console.log("[USER_ROLE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = async(
    req: Request,
) => {
    try {
        const session = await auth();

        if(!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session?.user.id;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const values = await req.json();

        const userAvatar = await db.update(user).set(values)
        .where(eq(user.id, userId))
        .returning();

        return NextResponse.json(userAvatar);
    } catch (error) {
        console.log("[USER_AVATAR_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
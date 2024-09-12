"use server";

import db from "@/db/drizzle";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token không tồn tại" };
    }

    if (!existingToken.expires) {
        return { error: "Token đã hết hạn" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token đã hết hạn" };
    }

    if (!existingToken.email) {
        return { error: "Token không hợp lệ" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Người dùng không tồn tại" };
    }

    await db.update(user).set({
        emailVerified: new Date(),
        email: existingToken.email
    }).where(eq(user.id, existingUser.id))
        .returning();

    await db.delete(user)
        .where(eq(user.id, existingToken.id))
        .returning();

    return { success: "Email đã được xác thực" };
};
"use server";
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { NewPasswordSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import db from '@/db/drizzle';
import { passwordResetToken, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if (!token) {
        return { error: "Token bị thiếu" }
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Dữ liệu không hợp lệ" }
    }

    const { password } = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Token không tồn tại" }
    }

    if (!existingToken.expires) {
        return { error: "Token không hợp lệ" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token đã hết hạn" }
    }

    if (!existingToken.email) {
        return { error: "Token không hợp lệ" }
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Người dùng không tồn tại" }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.update(user).set({
        password: hashedPassword
    }).where(eq(user.id, existingUser.id))
        .returning();

    await db.delete(passwordResetToken)
        .where(eq(passwordResetToken.id, existingToken.id
        ))
        .returning();

    return { success: "Mật khẩu đã được cập nhật" }
}
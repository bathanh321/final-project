"use server";

import * as z from 'zod';
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/mail';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Email không hợp lệ" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Không tìm thấy người dùng" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (passwordResetToken.email && passwordResetToken.token) {
        await sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token,
        );
    } else {
        return { error: "Xảy ra lỗi trong quá trình xác thực" };
    }

    return { success: "Một email đã được gửi đến hòm thư của bạn" };
}
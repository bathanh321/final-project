"use server";

import db from "@/db/drizzle";
import * as z from 'zod';
import bcrypt from "bcryptjs";

import { RegisterSchema } from '@/schemas';
import { user } from "@/db/schema";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Trường không hợp lệ" };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email đã được sử dụng" };
    }

    await db.insert(user).values({
        name,
        email,
        password: hashedPassword,
    }).returning();

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )

    return { success: "Đã gửi email xác thực" };
};
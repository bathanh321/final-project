"use server";

import db from "@/db/drizzle";
import * as z from 'zod';
import bcrypt from "bcryptjs";

import { RegisterSchema } from '@/schemas';
import { users } from "@/db/schema";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already exists" };
    }

    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
    }).returning();

    //TODO: Send email verification

    return { success: "User created!" };
};
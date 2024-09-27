import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import db from '@/db/drizzle';
import { passwordResetToken, verificationToken } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.delete(passwordResetToken)
            .where(eq(passwordResetToken.id, existingToken.id))
            .returning();
    };

    const [newPasswordResetToken] = await db.insert(passwordResetToken).values({
        email,
        token,
        expires
    }).returning();

    return newPasswordResetToken;
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.delete(verificationToken)
            .where(eq(verificationToken.id, existingToken.id))
            .returning();
    }

    const [newVerificationToken] = await db.insert(verificationToken).values({
        email,
        token,
        expires,
    })
        .returning();

    return newVerificationToken;
};

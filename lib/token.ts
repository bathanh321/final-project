import { getVerificationTokenByEmail } from '@/data/verification-token';
import db from '@/db/drizzle';
import { verificationToken } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.delete(verificationToken)
            .where(eq(verificationToken.id, existingToken.id))
            .returning();
    }

    const newVerificationToken = await db.insert(verificationToken).values({
        email,
        token,
        expires,
    })
    .returning();

    return newVerificationToken[0];
}
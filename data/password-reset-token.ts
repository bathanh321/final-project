import db from "@/db/drizzle"

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetToken.findFirst({
            where: (passwordResetToken, { eq }) => eq(passwordResetToken.token, token)
        });

        return passwordResetToken;
    } catch {
        return null;
    }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetToken.findFirst({
            where: (passwordResetToken, { eq }) => eq(passwordResetToken.email, email)
        });

        return passwordResetToken;
    } catch {
        return null;
    }
}
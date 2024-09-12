import db from "@/db/drizzle";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, email),
        });

        return user;
    } catch {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, id),
        });

        return user;
    } catch {
        return null;
    }
};
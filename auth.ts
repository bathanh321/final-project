import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import db from "./db/drizzle"
import { getUserById } from "./data/user"
import { eq } from "drizzle-orm"
import { user as users } from "./db/schema"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.update(users)
        .set({
          emailVerified: new Date()
        })
        .where(eq(users.id, user.id))
        .returning();
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;

      const existingUser = await getUserById(user.id);

      //Prevent sign in  without email verification
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    }
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
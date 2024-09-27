import NextAuth, { type DefaultSession } from "next-auth"
import { userRole } from "@/db/schema";

export type ExtendedUser = DefaultSession["user"] & {
    role: userRole;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}
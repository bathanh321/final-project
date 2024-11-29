import { auth } from "@/auth";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUserById } from "@/data/user";
import { UserRole } from "@/db/schema";
import { redirect } from "next/navigation";
import { UserInfoForm } from "./user-infor-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface UserIdPageProps {
    params: {
        userId: string;
    }
}

const UserIdPage = async ({ params }: UserIdPageProps) => {
    const session = await auth();

    if (!session) {
        redirect("/auth/login");
    }

    const userId = params.userId;

    const user = await getUserById(userId);

    if (!user) {
        redirect("/admin/users");
    }

    return (
        <div className="p-6">
            <Link
                href={`/admin/users`}
                className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
                <ArrowLeft className="size-4 mr-2" />
                Back to Admin setup
            </Link>
            <UserInfoForm user={user} />
        </div>
    );
}

export default UserIdPage;
"use client";

import { FileText, KeyRound, Loader, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { LoginButton } from "./login-button";

export const UserButton = () => {
    const { user, isLoading } = useCurrentUser();

    const avatarFallback = user?.name?.charAt(0).toUpperCase();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }

    const isAdminPage = location.pathname.includes("/admin");
    const isStaffPage = location.pathname.includes("/staff");

    if (!user) {
        return (
            <div className="flex space-x-2">
                <LoginButton mode="modal">
                    <Button>
                        Đăng nhập
                    </Button>
                </LoginButton>
                <Button asChild>
                    <Link href="/auth/register">Đăng ký</Link>
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-sky-500">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="size-4 mr-2" />
                        Đăng xuất
                    </DropdownMenuItem>
                </LogoutButton>
                <Link href="/profile">
                    <DropdownMenuItem>
                        <UserIcon className="size-4 mr-2" />
                        Profile
                    </DropdownMenuItem>
                </Link>
                {(user.role === "ADMIN" && !isAdminPage) && (
                    <Link href="/admin/users">
                        <DropdownMenuItem>
                            <KeyRound className="size-4 mr-2" />
                            Go to Admin Mode
                        </DropdownMenuItem>
                    </Link>
                )}
                {((user.role === "ADMIN" || user.role === "STAFF") && !isStaffPage) && (
                    <Link href="/staff/courses">
                        <DropdownMenuItem>
                            <FileText className="size-4 mr-2" />
                            Go to Staff Mode
                        </DropdownMenuItem>
                    </Link>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { UserButton } from "./auth/user-button";
import { usePathname } from "next/navigation";

type Props = {
    className?: string;
}

export const Sidebar = ({ className }: Props) => {
    const pathname = usePathname();

    const isAdmin = pathname.startsWith("/admin");
    const isStaff = pathname.startsWith("/staff");
    const isUser = pathname.startsWith("/user");

    return (
        <div className={cn(
            "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col justify-between",
            className
        )}>
            <div>
                <Link href={isAdmin ? "/admin" : isStaff ? "/staff" : "/user"}>
                    <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                        <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
                        <h1 className="text-2xl font-extrabold text-purple-600 tracking-wide">
                            Sololingo
                        </h1>
                    </div>
                </Link>
                <div className="flex flex-col gap-y-2 gap-1">
                    {isAdmin ? (
                        <>
                            <SidebarItem
                                label="Users"
                                href="/admin"
                            />
                            <SidebarItem
                                label="Analytics"
                                href="/admin/analytics"
                            />
                        </>
                    ) : isStaff ? (
                        <>
                            <SidebarItem
                                label="Courses"
                                href="/staff/courses"
                            />
                            <SidebarItem
                                label="Units"
                                href="/staff/units"
                            />
                            <SidebarItem
                                label="Lessons"
                                href="/staff/lessons"
                            />
                            <SidebarItem
                                label="Challenge"
                                href="/staff/challenges"
                            />
                        </>
                    ) : (
                        <>
                            <SidebarItem
                                label="course"
                                href="/admin"
                            />
                            <SidebarItem
                                label="Leaderboard"
                                href="/leaderboard"
                            />
                            <SidebarItem
                                label="Quests"
                                href="/quests"
                            />
                            <SidebarItem
                                label="Shop"
                                href="/shop"
                            />
                        </>
                    )
                    }
                </div>
            </div>
            <div className="p-4">
                <UserButton />
            </div>
        </div>
    )
}
import { auth } from "@/auth";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProgress } from "@/components/user-progress";
import { getUserById } from "@/data/user";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from "date-fns";
import Image from "next/image";
import { InfinityIcon, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Statistic } from "./statistic";
import { useState } from "react";

const ProfilePage = async () => {
    const session = await auth();
    const userProgressData = getUserProgress();
    const userSubsciprtionData = getUserSubscription();
    const leaderboarData = getTopTenUsers();

    if (!session?.user.id) {
        redirect("/auth/login");
    }

    const user = await getUserById(session.user.id);

    if (!user) {
        redirect("/auth/login");
    }

    const [
        userProgress, 
        userSubsciprtion,
        leaderboard
    ] = await Promise.all([
        userProgressData, 
        userSubsciprtionData,
        leaderboarData
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    const avatarFallback = user.name?.charAt(0).toUpperCase();

    const isPro = !!userSubsciprtion?.isActive;

    const isInTopTen = leaderboard.some((leader) => leader.userId === user.id);

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={isPro}
                />
                {!isPro && <Promo />}
                <Quests points={userProgress.points} />
            </StickyWrapper>
            <FeedWrapper>
                <div className="p-6">
                    <div>
                        <div className="flex flex-col gap-y-7 items-center justify-center">

                            <Avatar className="w-20 h-20">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-sky-500 text-3xl">
                                    {avatarFallback}
                                </AvatarFallback>
                                <Button variant="ghost" className="absolute top-10 -right-4 rounded-full">
                                    <Pencil />
                                </Button>
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex justify-between space-y-4 mt-4">
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <h2 className="text-muted-foreground">{user.name}</h2>
                            <p className="text-neutral-700 font-semibold">Joined {format(new Date(user.emailVerified!), "MMMM, yyyy")}</p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div />
                            <Button variant="ghost">
                                <Image
                                    src={userProgress.activeCourse.imageSrc || "/learn.svg"}
                                    alt={userProgress.activeCourse.title}
                                    className="rounded-md border"
                                    width={32}
                                    height={32}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
                <Separator className="h-1 rounded-lg" />
                <h1 className="mt-6 text-3xl font-bold text-neutral-600">Thống kê</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <Statistic iconSrc={"/heart.svg"} Icon={"hearts"} value={!isPro ? userProgress.hearts.toString() : <InfinityIcon/>} unit={"Trái tim"} />
                    <Statistic iconSrc={"/points.svg"} Icon={"points"} value={userProgress.points.toString()} unit={"Điểm"} />
                    <Statistic iconSrc={"/leaderboard.svg"} Icon={"leaderboard"} value={isInTopTen ? "Đạt top 10" : "Không có"} unit={"Top 10 người điểm cao"} />
                </div>

                <Separator className="h-1 rounded-lg" />

            </FeedWrapper>
        </div>
    );
}

export default ProfilePage;
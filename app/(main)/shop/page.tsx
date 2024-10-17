import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./items";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const ShopPage = async () => {
    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();

    const [
        userProgress,
        userSubsciprtion
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    const isPro = !!userSubsciprtion?.isActive;

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={isPro}
                />
                {!isPro && <Promo/>}
                <Quests points={userProgress.points}/>
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src="/shop.svg"
                        alt="Shop"
                        width={90}
                        height={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Cửa hàng
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Dùng điểm của bạn để mua vài thứ hay ho
                    </p>
                    <Items
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        hasActiveSubscription={isPro}
                    />
                </div>
            </FeedWrapper>
        </div>
    );
}

export default ShopPage;
"use client";

import { refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface ItemsProps {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
};

export const Items = ({
    hearts,
    points,
    hasActiveSubscription,
}: ItemsProps) => {
    const [pending, startTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < 50) {
            return;
        }

        startTransition(() => {
            refillHearts()
            .catch(() => toast.error("Something went wrong"))
        })
    }

    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image
                    src="/heart.svg"
                    alt="Heart"
                    width={60}
                    height={60}
                />
                <div className="flex-1">
                    <p>
                        Hồi phục trái tim
                    </p>
                </div>
                <Button
                    onClick={onRefillHearts}
                    disabled={pending || hearts === 5 || points < 50}
                >
                    {hearts === 5 ? "Đã đầy" : (
                        <div className="flex items-center">
                            <Image
                                src="/points.svg"
                                alt="Points"
                                width={20}
                                height={20}
                            />
                            <p>
                                50
                            </p>
                        </div>
                    )}
                </Button>
            </div>
        </ul>
    )
}
import Image from "next/image";
import { ReactNode } from "react";

interface StatisticProps {
    iconSrc: string;
    Icon: string;
    value: ReactNode;
    unit: string;
}

export const Statistic = ({ iconSrc, Icon, value, unit }: StatisticProps) => {
    return (
        <div className="flex items-center w-full p-4 gap-x-4 border-2 rounded-xl">
            <Image
                src={iconSrc}
                alt={Icon}
                width={48}
                height={48}
            />
            <div className="flex-1">
                <p className="text-neutral-700 text-base lg:text-xl font-bold">
                    {value}
                </p>
                <p className="text-neutral-500 text-sm lg:text-base">
                    {unit}
                </p>
            </div>
        </div>
    );
};
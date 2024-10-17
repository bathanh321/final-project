import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

export const Promo = () => {
    return (
        <div className="border-2 rounded-xl p-4 space-y-4">
            <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                    <Image
                        src="/unlimited.svg"
                        alt="Pro"
                        height={26}
                        width={26}
                    />
                    <h3 className="font-bold text-lg">
                        Nâng cấp lên thành viên VIP
                    </h3>
                </div>
                <p className="text-muted-foreground">
                    Nhận vô hạn trái tim và hơn thế nữa!
                </p>
            </div>

            <Button
                asChild
                variant="super"
                className="w-full"
                size="lg"
            >
                <Link href="/shop">
                    Nâng cấp ngay
                </Link>
            </Button>

        </div>
    )
}
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHeartsModal } from "@/store/use-hearts-modal";
import Image from "next/image";

export const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useHeartsModal();

    useEffect(() => setIsClient(true), [])

    const onClick = () => {
        close();
        router.push("/shop");
    }

    if (!isClient) {
        setIsClient(true);
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src="/mascot_bad.svg"
                            alt="Mascot"
                            width={80}
                            height={80}
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Bạn đã hết trái tim
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Mua thành viên VIP để không giới hạn trái tim, hoặc mua thêm trong cửa hàng
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            variant="super"
                            className="w-full"
                            size="lg"
                            onClick={onClick}
                        >
                            Mua thành viên VIP
                        </Button>
                        <Button
                            variant="primaryOutline"
                            className="w-full"
                            size="lg"
                            onClick={close}
                        >
                            Không, cảm ơn
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
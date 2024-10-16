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
import { useExitModal } from "@/store/use-exit-modal";
import Image from "next/image";

export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useExitModal();

    useEffect(() => setIsClient(true), [])

    if (!isClient) {
        setIsClient(true);
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src="/mascot_sad.svg"
                            alt="Mascot"
                            width={80}
                            height={80}
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Chờ đã, bạn có chắc chắn muốn thoát không?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Bạn muốn rời khỏi bài học này? Quá trình học của bạn có thể không được lưu, bạn chắc chứ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={close}
                        >
                            Tiếp tục học
                        </Button>
                        <Button
                            variant="dangerOutline"
                            className="w-full"
                            size="lg"
                            onClick={() =>{
                                close();
                                router.push("/learn");
                            }}
                        >
                            Rời khỏi
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
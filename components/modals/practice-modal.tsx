"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { usePracticeModal } from "@/store/use-practice-modal";

export const PracticeModal = () => {
    const [isClient, setIsClient] = useState(false);
    const {isOpen, close} = usePracticeModal();

    useEffect(() => setIsClient(true), []);

    if(!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src="/heart.svg"
                            alt="Heart"
                            height={100}
                            width={100}
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Đây là bài luyện tập lại
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Luyện tập lại bài học cũ giúp bạn nhận lại trái tim và điểm. Bạn không thể mất trái tim hay điểm trong bài luyện tập
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button 
                            variant="primary" 
                            className="w-full"
                            size="lg"
                            onClick={close}
                        >
                            Tôi hiểu rồi
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react";

interface ActionsProps {
    disabled: boolean;
    courseId: number;
    isPublished: boolean | null;
}

export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={() => {}}
                disabled={false}
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={() => {}}>
                <Button size="sm" disabled={false}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}
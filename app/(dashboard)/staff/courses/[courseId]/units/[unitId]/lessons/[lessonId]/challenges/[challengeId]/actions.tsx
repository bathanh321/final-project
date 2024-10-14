"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    unitId: string;
    lessonId: string;
    challengeId: string;
    isPublished: boolean | null;
}

export const Actions = ({
    disabled,
    courseId,
    unitId,
    lessonId,
    challengeId,
    isPublished,
}: ActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/challenges/${challengeId}/unpublish`);
                toast.success("Challenge unpublished");
            } else {
                await axios.patch(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/challenges/${challengeId}/publish`);
                toast.success("Challenge published");
            }

            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/challenges/${challengeId}`);

            toast.success("Challenge deleted successfully");
            router.push(`/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete} title="Are you sure to delete this challenge?" content="This action can't be undone">
                <Button size="sm" disabled={isLoading}>
                    <Trash className="size-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}
"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button"
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
    isPublished: boolean | null;
}

export const Actions = ({
    disabled,
    courseId,
    unitId,
    lessonId,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if(isPublished) {
                await axios.patch(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/unpublish`);
                toast.success("Lesson unpublished");
            } else {
                await axios.patch(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/publish`);
                toast.success("Lesson published");
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

            await axios.delete(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);

            toast.success("Lesson deleted successfully");
            router.push(`/staff/courses/${courseId}/units/${unitId}`);
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
            <ConfirmModal onConfirm={onDelete} title="Are you sure to delete this lesson?" content="This action can't be undone">
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}
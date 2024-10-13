"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { ChallengeOptionSchemaImageSrc } from "@/schemas";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ChallengeOptionImageFormProps {
    initialData: {
        imageSrc: string | null;
    },
    courseId: string;
    unitId: string;
    lessonId: string;
    challengeId: string;
    challengeOptionId: string;
}

export const ChallengeOptionImageForm = ({
    initialData,
    courseId,
    unitId,
    lessonId,
    challengeId,
    challengeOptionId
}: ChallengeOptionImageFormProps) => {
   const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof ChallengeOptionSchemaImageSrc>) => {
        try {
            await axios.patch(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/challenges/${challengeId}/challengeOptions/${challengeOptionId}`, values);
            toast.success("Challenge option updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Challenge option image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}

                    {!isEditing && !initialData.imageSrc && (
                        <>
                            <PlusCircle className="size-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageSrc && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageSrc ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="size-10 text-slate-500"/>
                    </div>
                ): (
                    <div className="relative mt-2 h-60 w-60 mx-auto">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageSrc}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="challengeOptionsImage"
                        onChange={(url) => {
                            if(url) {
                                onSubmit({imageSrc: url});
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}
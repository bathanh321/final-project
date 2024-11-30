"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FileAudio, Pencil, PlusCircle } from "lucide-react";
import { ChallengeOptionSchemaAudioSrc } from "@/schemas";
import { FileUpload } from "@/components/file-upload";

interface ChallengeOptionAudioFormProps {
    initialData: {
        audioSrc: string | null;
    },
    courseId: string;
    unitId: string;
    lessonId: string;
    challengeId: string;
    challengeOptionId: string;
}

export const ChallengeOptionAudioForm = ({
    initialData,
    courseId,
    unitId,
    lessonId,
    challengeId,
    challengeOptionId
}: ChallengeOptionAudioFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof ChallengeOptionSchemaAudioSrc>) => {
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
                Challenge option audio
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}

                    {!isEditing && !initialData.audioSrc && (
                        <>
                            <PlusCircle className="size-4 mr-2" />
                            Add an audio
                        </>
                    )}
                    {!isEditing && initialData.audioSrc && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.audioSrc ? (
                    <div className="flex items-center justify-center h-20 bg-slate-200 rounded-md">
                        <FileAudio className="size-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 h-20 mx-auto">
                        <audio controls>
                            <source src={initialData.audioSrc} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="challengeOptionsAudio"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ audioSrc: url });
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
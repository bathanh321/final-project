"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Pencil } from "lucide-react";
import { ChallengeOptionSchemaCorrect, ChallengeSchemaChallengeOption, ChallengeSchemaQuestion } from "@/schemas";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ChallengeOptionCorrectFormProps {
    initialData: {
        correct: boolean;
    },
    courseId: string;
    unitId: string;
    lessonId: string;
    challengeId: string;
    challengeOptionId: string;
}

export const ChallengeOptionCorrectForm = ({
    initialData,
    courseId,
    unitId,
    lessonId,
    challengeId,
    challengeOptionId
}: ChallengeOptionCorrectFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof ChallengeOptionSchemaCorrect>>({
        resolver: zodResolver(ChallengeOptionSchemaCorrect),
        defaultValues: {
            correct: initialData.correct || false,
        },
    })

    const onSubmit = async (values: z.infer<typeof ChallengeOptionSchemaCorrect>) => {
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
                Challenge Option Correct
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    <div className={cn(
                        "text-sm mt-2",
                        !initialData.correct && "text-slate-500 italic"
                    )}>
                        {initialData.correct ? (
                            <>This chapter is correct</>
                        ) : (
                            <>This option is incorrect</>
                        )}
                    </div>
                </>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="correct"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want this option to be true
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={false}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
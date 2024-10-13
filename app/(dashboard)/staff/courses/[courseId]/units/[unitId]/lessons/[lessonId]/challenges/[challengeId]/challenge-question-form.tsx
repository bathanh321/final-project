"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Pencil } from "lucide-react";
import { ChallengeSchemaQuestion } from "@/schemas";
import { Input } from "@/components/ui/input";

interface ChallengeQuestionFormProps {
    initialData: {
        question: string;
    },
    courseId: string;
    unitId: string;
    lessonId: string;
    challengeId: string
}

export const ChallengeQuestionForm = ({
    initialData,
    courseId,
    unitId,
    lessonId,
    challengeId
}: ChallengeQuestionFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof ChallengeSchemaQuestion>>({
        resolver: zodResolver(ChallengeSchemaQuestion),
        defaultValues: {
            question: initialData.question || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ChallengeSchemaQuestion>) => {
        try {
            await axios.patch(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/challenges/${challengeId}`, values);
            toast.success("Challenge updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Challenge question
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
                    <p className="text-sm mt-2">
                        {initialData.question}
                    </p>
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
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={false}
                                            placeholder="Introduction"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
    );
};
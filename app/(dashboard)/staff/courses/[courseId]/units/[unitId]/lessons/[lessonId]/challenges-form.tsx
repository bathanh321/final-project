"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { ChallengeSchemaQuestion, LessonSchemaTitle, UnitSchemaLesson } from "@/schemas";
import { cn } from "@/lib/utils";
import { ClimbingBoxLoader } from "react-spinners";
import { ChallengesList } from "./challenges-list";

interface Challenge {
    id: number;
    question: string;
    type: "SELECT" | "ASSIST";
    difficultLevel: number;
    isPublished: boolean;
    order: number;
}

interface ChallengesFormProps {
    initialData: {
        title: string;
        isPublished: boolean;
        order: number;
        challenges: Challenge[];
    },
    lessonId: number;
}

export const ChallengesForm = ({
    initialData,
    lessonId
}: ChallengesFormProps) => {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId;
    const [isCreating, setIsCreating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const form = useForm<z.infer<typeof ChallengeSchemaQuestion>>({
        resolver: zodResolver(ChallengeSchemaQuestion),
        defaultValues: {
            question: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof ChallengeSchemaQuestion>) => {
        try {
            await axios.post(`/api/staff/courses/${courseId}/units/${params.unitId}/lessons/${lessonId}/challenges`, values);
            toast.success("Challenge created");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    const onEdit = (id: number) => {
        router.push(`/staff/courses/${courseId}/units/${params.unitId}/lessons/${params.lessonId}/challenges/${id}`);
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Challenges
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a challenge
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
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
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.challenges?.length && "text-slate-500 italic"
                )}>
                    {!initialData.challenges?.length || initialData.challenges[0].id === 0 ? "No challenges" : (

                        <ChallengesList
                            onEdit={onEdit}
                            items={initialData.challenges}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
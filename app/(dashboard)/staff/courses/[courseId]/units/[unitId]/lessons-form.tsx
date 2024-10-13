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
import { LessonSchemaTitle, UnitSchemaLesson } from "@/schemas";
import { cn } from "@/lib/utils";
import { ClimbingBoxLoader } from "react-spinners";
import { LessonsList } from "./lessons-list";

interface Lesson {
    id: string;
    title: string;
    isPublished: boolean;
    order: number;
}

interface LessonsFormProps {
    initialData: {
        title: string;
        description: string;
        isPublished: boolean;
        order: number;
        lessons: Lesson[];
    },
    unitId: string;
}

export const LessonsForm = ({
    initialData,
    unitId
}: LessonsFormProps) => {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId;
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const form = useForm<z.infer<typeof UnitSchemaLesson>>({
        resolver: zodResolver(UnitSchemaLesson),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof LessonSchemaTitle>) => {
        try {
            await axios.post(`/api/staff/courses/${courseId}/units/${unitId}/lessons`, values);
            toast.success("Lesson created");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    const onReorder = async (updatedData: { id: string, order: number }[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/staff/courses/${courseId}/units/${unitId}/lessons/reorder`, {
                list: updatedData,
            });

            toast.success("Lessons reordered");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/staff/courses/${courseId}/units/${unitId}/lessons/${id}`);
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <ClimbingBoxLoader className="text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Lessons
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a lesson
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
                            name="title"
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
                    !initialData.lessons?.length && "text-slate-500 italic"
                )}>
                    {!initialData.lessons?.length || initialData.lessons[0].id === 0 ? "No lessons" : (

                        <LessonsList
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.lessons || []}
                        />
                    )}
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    );
};
"use client";

import { useRouter } from "next/navigation";
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
import { ChallengeSchemaChallengeOption } from "@/schemas";
import { cn } from "@/lib/utils";
import { ChallengeOptionsList } from "./challenge-options-list";
import { challengeOptions, challenges } from "@/db/schema";

interface ChallengeOptionsFormProps {
    initialData: typeof challenges.$inferSelect & { challengeOptions: typeof challengeOptions.$inferSelect[] },
    courseId: string;
    unitId: string;
    lessonId: string;
    challengeId: string;
}

export const ChallengeOptionsForm = ({
    initialData,
    courseId,
    unitId,
    lessonId,
    challengeId
}: ChallengeOptionsFormProps) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const form = useForm<z.infer<typeof ChallengeSchemaChallengeOption>>({
        resolver: zodResolver(ChallengeSchemaChallengeOption),
        defaultValues: {
            text: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof ChallengeSchemaChallengeOption>) => {
        try {
            await axios.post(`/api/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/challenges/${challengeId}/challengeOptions`, values);
            toast.success("Challenge option created");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    const onEdit = (id: string) => {
        router.push(`/staff/courses/${courseId}/units/${unitId}/lessons/${lessonId}/challenges/${challengeId}/challengeOptions/${id}`);
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Challenge options
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a challenge option
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
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. Apple"
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
                    !initialData.challengeOptions?.length && "text-slate-500 italic"
                )}>
                    {!initialData.challengeOptions?.length && "No challenge options"}

                        <ChallengeOptionsList
                            onEdit={onEdit}
                            items={initialData.challengeOptions}
                        />
                </div>
            )}
        </div>
    );
};
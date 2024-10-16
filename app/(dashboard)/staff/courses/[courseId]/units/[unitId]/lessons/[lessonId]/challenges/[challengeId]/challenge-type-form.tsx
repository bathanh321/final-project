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
import { ChallengeSchemaType } from "@/schemas";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface ChallengeTypeFormProps {
    initialData: {
        type: "SELECT" | "ASSIST";
    },
    courseId: string;
    unitId: string;
    lessonId: string;
    challengeId: string
}

export const ChallengeTypeForm = ({
    initialData,
    courseId,
    unitId,
    lessonId,
    challengeId
}: ChallengeTypeFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof ChallengeSchemaType>>({
        resolver: zodResolver(ChallengeSchemaType),
        defaultValues: {
            type: initialData.type || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ChallengeSchemaType>) => {
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
                Challenge type
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
                        {initialData.type ? initialData.type : "Choose a type"}
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SELECT">SELECT</SelectItem>
                                                <SelectItem value="ASSIST">ASSIST</SelectItem>
                                            </SelectContent>
                                        </Select>
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
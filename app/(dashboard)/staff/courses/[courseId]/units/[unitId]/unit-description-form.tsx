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
import { Pencil } from "lucide-react";
import { UnitSchemaDescription } from "@/schemas";
import { cn } from "@/lib/utils";

interface UnitDescriptionFormProps {
    initialData: {
        description: string | null;
    },
    courseId: string;
    unitId: string;
}

export const UnitDescriptionForm = ({
    initialData,
    courseId,
    unitId
}: UnitDescriptionFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof UnitSchemaDescription>>({
        resolver: zodResolver(UnitSchemaDescription),
        defaultValues: {
            description: initialData.description || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof UnitSchemaDescription>) => {
        try {
            await axios.patch(`/api/staff/courses/${courseId}/units/${unitId}`, values);
            toast.success("Unit updated");
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
                Unit description
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
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.description && "text-slate-500 italic"
                    )}>
                        {initialData.description || "No description"}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={false}
                                            placeholder="Some description"
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
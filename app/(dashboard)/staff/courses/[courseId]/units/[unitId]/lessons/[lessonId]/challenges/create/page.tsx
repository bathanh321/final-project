"use client";

import { ChallengeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface CreateChallengesPageProps {
    initialData: {
        question: string | null;
        type: "SELECT" | "ASSIST";
        difficultLevel: number;
    }
    params: {
        courseId: number;
        unitId: number;
        lessonId: number;
    }
}

const options = [
    { label: "SELECT", value: "SELECT" },
    { label: "ASSIST", value: "ASSIST" },
];

const CreateChallengesPage = ({
    params,
    initialData,
}: CreateChallengesPageProps) => {
    const router = useRouter();
    const [value, setValue] = useState("");

    const form = useForm<z.infer<typeof ChallengeSchema>>({
        resolver: zodResolver(ChallengeSchema),
        defaultValues: {
            question: "",
            type: "SELECT",
            difficultLevel: undefined,
        }
    })

    const onSubmit = async (values: z.infer<typeof ChallengeSchema>) => {
        try {
            await axios.post(`/api/staff/courses/${params.courseId}/units/${params.unitId}/lessons/${params.lessonId}/challenges`, values);
            router.push(`/staff/courses/${params.courseId}/units/${params.unitId}/lessons/${params.lessonId}`);
            toast.success("Challenge created");
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/staff/courses/${params.courseId}/units/${params.unitId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to lesson setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Challenge creation
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center justify-between">
                    Challenge
                </div>

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
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={false}
                                            placeholder="Quả táo trong tiếng Anh là gì?"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select value={value} onValueChange={setValue}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="difficultLevel"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Difficult Level</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={false}
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
            </div>
        </div>
    );
}

export default CreateChallengesPage;
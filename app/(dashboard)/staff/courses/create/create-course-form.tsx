"use client"

import { CourseSchemaTitle } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import toast from "react-hot-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateCourseForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof CourseSchemaTitle>>({
        resolver: zodResolver(CourseSchemaTitle),
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CourseSchemaTitle>) => {
        try {
            const response = await axios.post("/api/staff/courses", values);
            console.log({ response });
            router.push('/staff/courses');
            toast.success("Course created");
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Course Title" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the title of your course.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Create Course</Button>
            </form>
        </Form>
    );
}
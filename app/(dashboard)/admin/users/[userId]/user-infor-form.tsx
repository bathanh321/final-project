"use client";

import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";
import { user, UserRole } from "@/db/schema";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

const UserRoleForm = z.object({
    role: z.string().min(1, {
        message: "Please select a role"
    }),
})

interface UserInfoFormProps {
    user: typeof user.$inferSelect
};

export const UserInfoForm = ({
    user
}: UserInfoFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof UserRoleForm>>({
        resolver: zodResolver(UserRoleForm),
        defaultValues: {
            role: user.role || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof UserRoleForm>) => {
        try {
            await axios.patch(`/api/admin/users/${user.id}`, values);
            toast.success("User role updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }
    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    User name: {user.name}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p>
                        Name
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        {user?.name}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p>
                        Email
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p>
                        Role
                    </p>
                    {!isEditing && (
                        <>
                            <Button onClick={toggleEdit} variant="ghost">
                                <span className="mr-2">{user?.role}</span> <Pencil className="h-4 w-4 mr-2" />
                            </Button>
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
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                        <SelectItem value="STAFF">STAFF</SelectItem>
                                                        <SelectItem value="USER">USER</SelectItem>
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
                                    <Button
                                        onClick={toggleEdit}
                                        variant="ghost"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p>
                        Email Verified
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        {format(user?.emailVerified, "PPP")}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
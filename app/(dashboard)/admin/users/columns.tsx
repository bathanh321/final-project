"use client"

import { user } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<typeof user>[] = [
    {
        accessorKey: "name",
        header: "User Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "emailVerified",
        header: "Email Verified",
        cell: ({ row }) => {
            const emailVerified = row.original.emailVerified as unknown as string;

            return (
                <div>
                    <span className="truncate">
                        {emailVerified ? format(new Date(emailVerified), "PPP") : "Not Verified"}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
            row.original.image ? (
                <Image
                    src={row.original.image as unknown as string}
                    alt="Profile Image"
                    width={50}
                    height={50}
                    className="rounded-sm max-w-20"
                />
            ) : "No Image"
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="w-8 h-4 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/admin/users/${id}`}>
                            <DropdownMenuItem>
                                <Pencil className="size-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

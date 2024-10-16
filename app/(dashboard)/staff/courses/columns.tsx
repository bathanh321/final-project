"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { courses } from "@/db/schema"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<typeof courses>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "imageSrc",
        header: "Image",
        cell: ({ row }) => (
            row.original.imageSrc ? (
                <img src={row.original.imageSrc} className="rounded-sm max-w-20" />
            ) : "No Image"
        ),
    },
    {
        accessorKey: "isPublished",
        header: "Published",
        cell: ({ row }) => {
            const isPublished = row.getValue("isPublished") || false;

            return (
                <Badge className={cn(
                    "bg-slate-500 max-h-4",
                    isPublished && "bg-sky-500"
                )}>
                    {isPublished ? "Published" : "Draft"}
                </Badge>
            )
        },
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
                        <Link href={`/staff/courses/${id}`}>
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

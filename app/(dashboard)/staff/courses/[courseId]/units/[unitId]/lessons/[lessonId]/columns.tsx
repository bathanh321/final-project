"use client"

import { Badge } from "@/components/ui/badge";
import { challenges } from "@/db/schema"
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<typeof challenges>[] = [
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "difficultLevel",
    header: "Level",
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
]

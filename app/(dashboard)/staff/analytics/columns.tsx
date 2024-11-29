"use client"

import { userSubscription } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";

export const columns: ColumnDef<typeof userSubscription>[] = [
    {
        accessorKey: "userName",
        header: "User Name",
    },
    {
        accessorKey: "stripeCustomerId",
        header: "Stripe Customer ID",
    },
    {
        accessorKey: "stripeSubscriptionId",
        header: "Stripe Subscription ID",
    },
    {
        accessorKey: "stripePriceId",
        header: "Stripe Price ID",
    },
    {
        accessorKey: "stripeCurrentPeriodEnd",
        header: "Stripe Current Period End",
        cell: ({ row }) => {
            const stripeCurrentPeriodEnd = row.original.stripeCurrentPeriodEnd;

            return (
                <div>
                    <span className="truncate">
                        {format(stripeCurrentPeriodEnd, "PPP")}
                    </span>
                </div>
            )
        }
    }
]

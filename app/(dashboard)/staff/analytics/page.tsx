import { auth } from "@/auth";
import db from "@/db/drizzle";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { eq } from "drizzle-orm";
import { user as users, userSubscription } from "@/db/schema";
import { format, subMonths } from "date-fns";
import { Chart } from "./chart";

const AnalyticsPage = async () => {
    const user = auth();

    if (!user) {
        return redirect("/auth/login");
    }

    const subscription = await db.query.userSubscription.findMany({
        with: {
            user: true
        },
        select: {
            userId: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            user: {
                select: {
                    name: true
                }
            }
        }
    });

    const subscriptionWithUserName = subscription.map(sub => ({
        ...sub,
        userName: sub.user.name
    }));

    const monthlyData = subscriptionWithUserName.reduce((acc, sub) => {
        const startDate = subMonths(new Date(sub.stripeCurrentPeriodEnd), 1);
        const month = format(startDate, "MMM yyyy");
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month]++;
        return acc;
    }, {} as Record<string, number>);

    const allMonths = Array.from({ length: 12 }, (_, i) => format(new Date(2024, i, 1), "MMM yyyy"));

    const chartData = allMonths.map(month => ({
        name: month,
        total: monthlyData[month] || 0,
    }));

    return (
        <div>
            <DataTable columns={columns} data={subscriptionWithUserName} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Subscription user in 2024</h1>
                <Chart data={chartData} />
            </div>
        </div>
    );
}

export default AnalyticsPage;
"use server";

import { auth } from "@/auth";
import { getUserSubscription } from "@/db/queries";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const returnUrl = absoluteUrl("/shop");

export const createStripeUrl = async () => {
    const session = await auth();

    if (!session || !session?.user.id || !session?.user.email) {
        throw new Error("User not found");
    }

    const email = session.user.email;

    const userSubscription = await getUserSubscription();

    if (userSubscription && userSubscription.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: returnUrl,
        });

        return { data: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: "Gói thành viên VIP Sololingo",
                        description: "Vô hạn trái tim",
                    },
                    unit_amount: 2000,
                    recurring: {
                        interval: "month",
                    },
                },
            },
        ],
        metadata: {
            userId: session.user.id,
        },
        success_url: returnUrl,
        cancel_url: returnUrl,
    });

    return {
        data: stripeSession.url,
    }
}
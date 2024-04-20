"use server";
import Stripe from "stripe";
import { db } from "../db";
import { stripe } from ".";
import { Plan } from "@prisma/client";

export const subscriptionCreated = async (
  subscription: Stripe.Subscription & { plan: Stripe.Plan | null },
  customerId: string
) => {
  try {
    const agency = await db.agency.findFirst({
      where: { customerId },
      include: { SubAccount: true },
    });

    if (!agency)
      throw new Error("Could not find an agency to upsert the subscription");
    const data = {
      active: subscription.status === "active",
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      priceId: subscription.plan!.id,
      subscriptionId: subscription.id,
      plan: subscription.plan!.id as Plan
    };
    const res = await db.subscription.upsert({
      where: { agencyId: agency.id },
      create: data,
      update: data,
    });
    console.log(`🟢 Created Subscription for ${subscription.id}`);
  } catch (error) {
    console.log(`🔴 Created Subscription for ${subscription.id}`);
  }
};

export const getConnectedAccountProducts = async (stripeAccount: string) => {
    const products = await stripe.products.list(
        {
        limit: 50,
        expand: ['data.default_price']
        },
        {
            stripeAccount
        }
  )
    return products.data
}

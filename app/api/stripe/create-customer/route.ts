import { stripe } from "@/lib/stripe";
import { StripeCustomerType } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { address, email, name, shipping } = (await req.json()) as StripeCustomerType
    console.log({ address, email, name, shipping });
    if (!(email && address && name && shipping))
        return new NextResponse('Missing some data', { status: 400 })
    try {
        const customer = await stripe.customers.create({
            email,
            name,
            address,
            shipping
        })
        return NextResponse.json({customerId: customer.id})
    } catch (error) {
        console.log('🔴 Error', error)
        return new NextResponse('Internal Server Error', {status:500})
    }
}
import React from 'react'
import { format } from 'date-fns'
import { addOnProducts, pricingCards } from '@/lib/constants'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { Separator } from '@/components/ui/separator'
import PricingCard from './_components/pricing-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import clsx from 'clsx'
import Stripe from 'stripe'
import SubscriptionHelper from './_components/subscription-helper'

type Props = {
  params: {
    agencyId: string
  }
}

const BillingPage = async ({ params: { agencyId } }: Props) => {

  const addOns: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
    ids: addOnProducts.map((product) => product.id),
    expand: ['data.default_price']
  })


  const agencySubscription = await db.agency.findUnique({
    where: { id: agencyId },
    select: {
      customerId: true,
      Subscription: true,
    }
  })

  const isPlanActive = !!agencySubscription?.Subscription?.active && agencySubscription.Subscription.active === true

  const prices = await stripe.prices.list({
    product: process.env.NEXT_OMEGA_PRODUCT_ID,
    active: true
  })

  const currentPlanDetails = pricingCards.find((c) => (
    agencySubscription?.Subscription?.priceId ?
      c.priceId === agencySubscription?.Subscription?.priceId :
      c.title === 'Starter'
  ))

  const charges = await stripe.charges.list({
    limit: 50,
    customer: agencySubscription?.customerId
  })

 // console.log({charges:charges.data})

  const allCharges = [
    ...charges.data.map((charge) => ({
      id: charge.id,
      description: charge.description,
      amount: `$${charge.amount / 100}`,
      status: 'Paid',
      date: format(charge.created * 1000, "MMMM do, yyyy  HH:mm a")
    }))
  ]

  return (
    <>
      <SubscriptionHelper
        prices={prices.data}
        customerId={agencySubscription?.customerId || ''}
        planExists={isPlanActive} />
      <h1 className='text-4xl p-4'>Billing</h1>
      <Separator />
      <h2 className='text-2xl p-4'>Current Plan</h2>
      <div className='flex flex-col lg:flex-row justify-between gap-8'>
        <PricingCard
          features={currentPlanDetails?.features!}
          buttonCta={isPlanActive ? 'Change Plan' : 'Get Started'}
          title={isPlanActive ? currentPlanDetails?.title! : 'Starter'}
          description={isPlanActive ? currentPlanDetails?.description! : 'Let\'s get started! Pick a plan that works best for you.'}
          amt={isPlanActive ? currentPlanDetails?.price! : '$0'}
          duration={'/month'}
          highlightTitle={'Plan Options'}
          highlightDescription={'Want to modify your plan? You can do this there. If you have further questions contact support@omega.com'}
          customerId={agencySubscription?.customerId || ''}
          prices={prices.data}
          planExists={isPlanActive} />

        {addOns.data.map((addOn) => (
          <PricingCard
            planExists={agencySubscription?.Subscription?.active === true}
            prices={prices.data}
            customerId={agencySubscription?.customerId || ''}
            key={addOn.id}
            amt={
              //@ts-ignore
              addOn.default_price?.unit_amount
                ? //@ts-ignore
                `$${addOn.default_price.unit_amount / 100}`
                : '$0'
            }
            buttonCta="Subscribe"
            description="Dedicated support line & teams channel for support"
            duration="/ month"
            features={[]}
            title={'24/7 priority support'}
            highlightTitle="Get support now!"
            highlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))}
      </div>
      <h2 className="text-2xl p-4">Payment History</h2>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead className="w-[200px]">Invoice Id</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="w-[200px]">Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allCharges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>{charge.description}</TableCell>
              <TableCell className="text-muted-foreground">
                {charge.id}
              </TableCell>
              <TableCell>{charge.date}</TableCell>
              <TableCell>
                <p
                  className={clsx('', {
                    'text-emerald-500': charge.status.toLowerCase() === 'paid',
                    'text-orange-600':
                      charge.status.toLowerCase() === 'pending',
                    'text-red-600': charge.status.toLowerCase() === 'failed',
                  })}
                >
                  {charge.status.toUpperCase()}
                </p>
              </TableCell>
              <TableCell className="text-right">{charge.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default BillingPage
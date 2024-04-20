import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const prices = await stripe.prices.list({
    product: process.env.NEXT_OMEGA_PRODUCT_ID,
    active: true
  })

  prices.data = [
    {
      nickname: 'Starter',
      id: "",
      object: "price",
      active: false,
      billing_scheme: "per_unit",
      created: 0,
      currency: "",
      custom_unit_amount: null,
      livemode: false,
      lookup_key: null,
      metadata: {},
      product: "",
      recurring: {
        interval: 'month',
        aggregate_usage: null,
        interval_count: 0,
        trial_period_days: 0,
        usage_type: 'licensed'
      },
      tax_behavior: null,
      tiers_mode: null,
      transform_quantity: null,
      type: "one_time",
      unit_amount: null,
      unit_amount_decimal: null
    },
    ...prices.data
  ]

  return (
    <>
      <section className="h-full w-full lg:pt-[12rem] relative flex items-center justify-center flex-col">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
        <p className="">
          Run your agency, in one place
        </p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold md:text-[300px] mb-6">
            Omega
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px] ">
          <Image
            src='/assets/preview.png'
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10" />
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 mt-[-60px] md:mt-16 lg:mt-[10rem]">
        <h2 className="text-4xl text-center">Choose what fits your right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward strategy pricing plans are tailored to meet your needs.
          If {" you're"} not <br /> ready to commit you can get started for free.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6">
          {prices.data.map((card) => (
            // WIP: Wire up free product from stripe
            <Card
              key={card.nickname}
              className={clsx("w-[300px] flex flex-col justify-between", {
                "border-2 border-primary": card.nickname === "Unlimited SaaS"
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('', {
                    "text-muted-foreground": card.nickname !== "Unlimited SaaS"
                  })}
                >
                  {card.nickname}
                </CardTitle>
                <CardDescription>{pricingCards.find(c => c.title === card.nickname)?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.unit_amount && card.unit_amount/100}</span>
                <span className="text-muted-foreground">/{card.recurring?.interval}</span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {pricingCards.find(c => c.title === card.nickname)
                    ?.features.map((feature) => (
                    <div key={feature} className="flex gap-2 items-center">
                      <Check />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/agency?plan=${card.id}`}
                  className={clsx("w-full text-center bg-primary p-2 rounded-md", {
                    "!bg-muted-foreground": card.nickname !== "Unlimited SaaS"
                  })}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}



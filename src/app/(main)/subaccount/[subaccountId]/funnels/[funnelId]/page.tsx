import React from 'react'
import { getFunnel } from '@/lib/queries'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FunnelSettings from './_components/funnel-settings'
import FunnelSteps from './_components/funnel-steps'
import Blur from '@/components/global/blur'

type Props = {
    params: {
        funnelId: string
        subaccountId: string
    }
}

const FunnelPage = async ({ params: { funnelId, subaccountId } }: Props) => {
    const funnelPages = await getFunnel(funnelId)
    if (!funnelPages)
        redirect(`/subaccount/${subaccountId}/funnels`)
  return (
      <Blur>
          <Link
              href={`/subaccount/${subaccountId}/funnels`}
              className='flex justify-between gap-4 mb-4 text-muted-foreground relative'
          >
              <Tooltip delayDuration={300}>
                  <TooltipTrigger>
                      <ArrowLeft />
                  </TooltipTrigger>
                  <TooltipContent className='p-2 w-fit absolute -top-4 left-5'>
                      <span className='text-xs p-2'>Back</span>
                  </TooltipContent>
              </Tooltip>
          </Link>
          <h1 className='text-3xl mb-8'>{funnelPages.name}</h1>
          <Tabs
              defaultValue="steps"
              className="w-full"
          >
              <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
                  <TabsTrigger value="steps">Steps</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="steps">
                  <FunnelSteps
                      funnel={funnelPages}
                      subaccountId={subaccountId}
                      pages={funnelPages.FunnelPages}
                      funnelId={funnelId}
                  />
              </TabsContent>
              <TabsContent value="settings">
                  <FunnelSettings
                      subaccountId={subaccountId}
                      defaultData={funnelPages}
                  />
              </TabsContent>
          </Tabs>
      </Blur>
  )
}

export default FunnelPage
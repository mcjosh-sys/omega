import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { redirect } from 'next/navigation'

import { getLanesWithTicketAndTags, getPipelineDetails, getPipelines, updateLanesOrder, updateTicketsOrder } from '@/lib/queries'
import {PipelineInfobar} from '../_components/pipline-infobar'
import PipelineView from '../_components/pipeline-view'
import PipelineSettings from '../_components/pipeline-settings'

type Props = {
    params: Promise<{
        pipelineId: string
        subaccountId: string
    }>
}

const PipelinePage = async (props: Props) => {
    const params = await props.params;

    const {
        pipelineId,
        subaccountId
    } = params;

    const pipelineDetails = await getPipelineDetails(pipelineId)
    if (!pipelineDetails)
        return redirect(`/subaccount/${subaccountId}/pipelines`)

    const pipelines = await getPipelines(subaccountId)

    const lanes = await getLanesWithTicketAndTags(pipelineId)

    return (
        <Tabs
            defaultValue='view'
            className='w-full'
        >
            <TabsList className='bg-transparent border-b-2 h-16 w-full justify-between mb-4'>
                <PipelineInfobar
                    pipelineId={pipelineId}
                    subaccountId={subaccountId}
                    pipelines={pipelines}
                />
                <div>
                    <TabsTrigger value="view">Pipeline View</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value="view">
                <PipelineView
                    lanes={lanes}
                    pipelineDetails={pipelineDetails}
                    pipelineId={pipelineId}
                    subaccountId={subaccountId}
                    updateLanesOrder={updateLanesOrder}
                    updateTicketsOrder={updateTicketsOrder}
                />
            </TabsContent>
            <TabsContent value="settings">
                <PipelineSettings
                    pipelineId={pipelineId}
                    pipelines={pipelines}
                    subaccountId={subaccountId}
                />
            </TabsContent>
        </Tabs>
    )
}

export default PipelinePage
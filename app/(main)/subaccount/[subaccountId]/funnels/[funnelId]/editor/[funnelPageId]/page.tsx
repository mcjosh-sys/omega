import { db } from '@/lib/db'
import EditorProvider from '@/providers/editor/editor-provider'
import { redirect } from 'next/navigation'
import React from 'react'
import FunnelEditorNavigation from './_components/funnel-editor-navigation'
import FunnelEditorSidebar from './_components/funnel-editor-sidebar'
import FunnelEditor from './_components/funnel-editor'

type Props = {
  params: Promise<{
    subaccountId: string
    funnelId: string
    funnelPageId: string
  }>
}

const Page = async (props: Props) => {
  const params = await props.params;

  const {
    subaccountId,
    funnelId,
    funnelPageId
  } = params;

  const funnelPageDetails = await db.funnelPage.findFirst({
    where: { id: funnelPageId }
  })

  if (!funnelPageDetails)
    return redirect(`/subaccount/${subaccountId}/funnels/${funnelId}`)


  return (
    <div className='fixed inset-0 z-[30] bg-background overflow-hidden'>
      <EditorProvider
        subaccountId={subaccountId}
        funnelId={funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={subaccountId}
        />
        <div className="h-full flex justify-center">
          <div className='h-[92%] w-full flex justify-center items-center p-6'>
            <FunnelEditor funnelPageId={funnelPageId} />
          </div>
        </div>
        <FunnelEditorSidebar subaccountId={subaccountId} />
      </EditorProvider>
    </div>
  )
}

export default Page
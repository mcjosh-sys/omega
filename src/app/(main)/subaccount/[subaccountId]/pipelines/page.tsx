import { createPipeline, getFirstPipeline } from '@/lib/queries'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    subaccountId: string
  }
}

const PipelinesPage = async ({ params: { subaccountId } }: Props) => {
  const hasPipeline = await getFirstPipeline(subaccountId)

  if (!hasPipeline) {
    try {
      const response = await createPipeline(subaccountId)
      return redirect(`/subaccount/${subaccountId}/pipelines/${response?.id}`)
    } catch (error) {
      console.log("[pipelines_page_error]\n", error)
    }
  }

  if (hasPipeline)
    return redirect(`/subaccount/${subaccountId}/pipelines/${hasPipeline.id}`)
  return (
    <div>PipelinesPage</div>
  )
}

export default PipelinesPage
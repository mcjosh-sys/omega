'use client'
import { deleteSubaccount, getSubaccountDetails, saveActivityAndNotify } from '@/lib/queries'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    subaccountId: string
}

export const DeleteButton: React.FC<Props> = ({ subaccountId }) => {
    const router = useRouter()
  return (
      <div
          onClick={async () => {
              const response = await getSubaccountDetails(subaccountId)
              await saveActivityAndNotify({
                  agencyId: undefined,
                  desc: `Deleted a subaccount | ${response?.name}`,
                  subaccountId
              })
              await deleteSubaccount(subaccountId)
              router.refresh()
          }}
      >Delete Sub Account</div>
  )
}
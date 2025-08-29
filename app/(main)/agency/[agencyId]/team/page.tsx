import React from 'react'
import { Plus } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'

import { DataTable } from './_components/data-table'
import { getAgencyDetails, getTeamMembers } from '@/lib/queries'
import { columns } from './columns'
import SendInvitation from '@/components/forms/send-invitation'

type Props = {
  params: Promise<{
    agencyId: string
  }>
}

const Team = async (props: Props) => {
  const params = await props.params;

  const {
    agencyId
  } = params;

  const authUser = await currentUser()
  const agencyDetails = await getAgencyDetails(agencyId, { subaccounts: true })

  if (!authUser || !agencyDetails) return

  const teamMembers = await getTeamMembers(agencyId)


  return (
    <DataTable
      actionButtonText={(
        <>
          <Plus size={15} /> Add
        </>
      )}
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      columns={columns}
      data={teamMembers!}
      filterValue='name'
    />
  )
}

export default Team
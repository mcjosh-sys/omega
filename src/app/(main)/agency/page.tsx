import AgencyDetails from '@/components/forms/agency-details'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

interface PageProps {
  searchParams: {
    plan: Plan
    state: string
    code: string
  }
}

const Page = async ({ searchParams }: PageProps) => {

  const agencyId = await verifyAndAcceptInvitation()

  const user = await getAuthUserDetails()

  if (agencyId) {
    if (['SUBACCOUNT_GUEST', 'SUBACCOUNT_USER'].includes(user?.role!)) {
      return redirect('/subaccount')
    } else if (['AGENCY_OWNER', 'AGENCY_ADMIN'].includes(user?.role!)) {
      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
      }

      if (searchParams.state) {
        const statePath = searchParams.state.split('___')[0]
        const stateAgencyId = searchParams.state.split('___')[1]

        if (!stateAgencyId) return <div>Not authorized</div>

        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
      } else redirect(`/agency/${agencyId}`)
    } else return <div>Not authorized</div>
  }

  const authUser = await currentUser()

  return (
    <div className='flex justify-center items-center mt-4'>
      <div className='max-w-[850px] border-[1px] p-4 rounded-xl'>
        <h1 className='text-4xl pb-4'> Create an Agency</h1>
        <AgencyDetails data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }} />
      </div>
    </div>
  )
}

export default Page
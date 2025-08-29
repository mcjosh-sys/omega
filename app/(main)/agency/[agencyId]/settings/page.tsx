import AgencyDetails from '@/components/forms/agency-details'
import UserDetails from '@/components/forms/user-details'
import { getSettingsPageData } from '@/lib/queries'
import React from 'react'

type Props = {
    params: Promise<{
        agencyId: string
    }>
}

const SettingsPage = async (props: Props) => {
    const params = await props.params;

    const userDetails = await getSettingsPageData(params.agencyId)

    if (!userDetails || !userDetails.Agency) return null

    const agencyDetails = userDetails.Agency

    const subAccounts = agencyDetails.SubAccount

    return (
        <div className='flex lg:flex-row flex-col gap-4'>
            <AgencyDetails
                data={agencyDetails}
            />
            <UserDetails
                type="agency"
                id={params.agencyId}
                subAccounts={subAccounts}
                userData = {userDetails}
            />
      </div>
    )
}

export default SettingsPage
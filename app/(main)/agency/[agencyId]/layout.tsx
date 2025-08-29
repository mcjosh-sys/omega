import Blur from '@/components/global/blur'
import Infobar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@/lib/generated/prisma'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: Promise<{
        agencyId: string
    }>
}

const layout = async (props: Props) => {
    const params = await props.params;

    const {
        children
    } = props;

    const agencyId = await verifyAndAcceptInvitation()

    const user = await currentUser()

    if (!user) {
        return redirect('/')
    }

    if (!agencyId) {
        return redirect('/')
    }

    if (!user.privateMetadata.role || !["AGENCY_OWNER", "AGENCY_ADMIN"].includes(user.privateMetadata.role as string)) {
        return <Unauthorized />
    }

    let allNotifications: any = []
    const notifications = await getNotificationAndUser(agencyId)
    if (notifications) allNotifications = notifications

    return (
        <div className='h-screen overflow-hidden'>
            <Sidebar
                id={params.agencyId}
                type='agency'
            />
            <div className='md:pl-[300px]'>
                <Infobar
                    notifications={allNotifications}
                    role={user.privateMetadata?.role as (Role | undefined)}
                />
                <div className='relative'>
                    <Blur>
                        {children}
                    </Blur>
                </div>
            </div>
        </div>
    )
}

export default layout
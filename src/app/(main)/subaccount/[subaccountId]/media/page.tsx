import Blur from '@/components/global/blur'
import MediaComponent from '@/components/media'
import { getMedia } from '@/lib/queries'
import React from 'react'

type Props = {
    params: {
        subaccountId: string
    }
}

const MediaPage = async ({ params: { subaccountId } }: Props) => {
    const data = await getMedia(subaccountId)
    return (
        <Blur>
            <MediaComponent data={data} subaccountId={subaccountId} />
        </Blur>
    )
}

export default MediaPage
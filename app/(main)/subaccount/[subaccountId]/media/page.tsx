import Blur from '@/components/global/blur'
import MediaComponent from '@/components/media'
import { getMedia } from '@/lib/queries'
import React from 'react'

type Props = {
    params: Promise<{
        subaccountId: string
    }>
}

const MediaPage = async (props: Props) => {
    const params = await props.params;

    const {
        subaccountId
    } = params;

    const data = await getMedia(subaccountId)
    return (
        <Blur>
            <MediaComponent data={data} subaccountId={subaccountId} />
        </Blur>
    )
}

export default MediaPage
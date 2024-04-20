'use client'
import React, { useEffect, useState } from 'react'
import MediaComponent from '@/components/media'
import { getMedia } from '@/lib/queries'
import { SubAccountWithMedia } from '@/types'

type Props = {
    subaccountId: string
}

const MediaBucketTab = ({ subaccountId }: Props) => {
    const [data, setData] = useState<SubAccountWithMedia>(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMedia(subaccountId)
            setData(res)
        }
        fetchData()
    },[subaccountId])
  return (
      <div className='h-[900] overflow-scroll p-4'>
          <MediaComponent subaccountId={subaccountId} data={data} />
    </div>
  )
}

export default MediaBucketTab
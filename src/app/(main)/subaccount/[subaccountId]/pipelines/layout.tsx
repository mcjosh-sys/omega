import Blur from '@/components/global/blur'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const PinpelinesLayout = ({children}: Props) => {
  return (
      <Blur>
          {children}
    </Blur>
  )
}

export default PinpelinesLayout
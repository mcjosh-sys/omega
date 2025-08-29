import React from 'react'

type Props = {
  children: React.ReactNode
  
}

const Blur = ({ children }: Props) => {
  return (
    <div className='h-screen overflow-auto backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black  mx-auto pt-24 p-4 absolute inset-0 z-[11]' id='blur'>
      {children}
    </div>
  )
}

export default Blur
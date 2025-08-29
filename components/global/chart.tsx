'use client'
import React from 'react'
import { AreaChart } from '@tremor/react'
import { formatCurrency } from '@/lib/utils'

type Props = {
  data: any
}

const Chart = ({ data }: Props) => {
  const numberFormatter = (value: number) => {
    return `${value / 1000}k`
  }
  
  return (
    <AreaChart
      className="text-sm stroke-primary"
      data={data}
      index="created"
      categories={['amount_total']}
      valueFormatter={formatCurrency}
      colors={['primary']}
      yAxisWidth={50}
      showAnimation={true}
    />
  )
}

export default Chart
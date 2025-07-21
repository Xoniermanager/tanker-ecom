'use client'

import Link from 'next/link'
import React from 'react'
import { BsBoxSeam } from "react-icons/bs"
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ProductSold = () => {
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        dataLabels: {
          position: 'top', 
        },
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toString()
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      position: 'bottom',
      labels: {
        style: {
          colors: '#fff',
          fontSize: '12px'
        }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: false
    },
    grid: { show: false },
    tooltip: { theme: 'dark' },
    colors: ['#ffffff'],
    
  }

  const chartSeries = [{
    name: 'Products Sold',
    data: [12, 15, 8, 14, 10, 16, 14]
  }]

  return (
    <Link href={''} className='p-8 rounded-xl flex flex-col gap-0 hover:scale-[1.04] hover:shadow-[0_0_18px_#00000018] bg-violet-700/60 transition-all duration-300'>
      <div className="flex flex-col gap-4 items-center justify-center">
        <span className='text-white text-5xl'><BsBoxSeam /></span>
        <h3 className='text-white text-3xl'>Products Sold</h3>
        <span className='text-white font-medium text-lg'>89 Sold</span>
      </div>
      <div className='w-full '>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={190}
        />
      </div>
    </Link>
  )
}

export default ProductSold

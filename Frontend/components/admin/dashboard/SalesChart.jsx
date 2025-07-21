'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { BsQuestionCircle, BsThreeDots } from 'react-icons/bs'


const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const months = ['January', 'February', 'March', 'April', 'May', 'June']

const SalesChart = () => {
  const [selectedMonth, setSelectedMonth] = useState('June')

  
  const salesData = {
    January: { sales: [800, 1000, 1200], orders: [600, 700, 900], total: 3000 },
    February: { sales: [1000, 1200, 1400], orders: [700, 800, 1000], total: 3600 },
    March: { sales: [1200, 1500, 1800], orders: [1000, 1200, 1400], total: 4500 },
    April: { sales: [1500, 1700, 1900], orders: [1300, 1400, 1600], total: 5100 },
    May: { sales: [1700, 2000, 2300], orders: [1400, 1600, 1800], total: 6000 },
    June: { sales: [1900, 2200, 2500], orders: [1600, 1800, 2000], total: 6600 },
  }

  const data = salesData[selectedMonth]

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#f97316', '#22c55e'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      shared: true,
      intersect: false,
    }
  }

  const chartSeries = [
    {
      name: 'Sales',
      data: data.sales
    },
    {
      name: 'Orders',
      data: data.orders
    }
  ]

  return (
    <div className='w-full flex flex-col gap-6 '>
   
      <div className='flex items-center justify-between gap-8'>
        <h2 className='text-2xl font-semibold flex gap-3 items-center'>
          Sales Chart 
          <span className='text-red-500 text-xl cursor-pointer hover:scale-105 transition'>
            <BsQuestionCircle />
          </span>
        </h2>
        <button className='hover:text-orange-500 hover:scale-105 transition'>
          <BsThreeDots />
        </button>
      </div>

      <div className='p-8 bg-white rounded-2xl shadow-[0_0_8px_#00000015]'> 
      <div className='flex items-center justify-between flex-wrap gap-4'>
        
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>Select Month:</label>
          <select
            className='border px-3 py-1 rounded-md outline-none text-sm'
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        
        <div className='text-sm font-semibold text-green-600'>
          Total Income: <span className='text-black text-base font-bold'>${data.total.toLocaleString()}</span>
        </div>
      </div>

      
      <div className='w-full'>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type='line'
          height={350}
        />
      </div>
      </div>
    </div>
  )
}

export default SalesChart

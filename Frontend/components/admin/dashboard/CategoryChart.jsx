'use client'
import React from 'react'
import { BsQuestionCircle, BsThreeDots } from 'react-icons/bs'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CategoryChart = () => {
  const chartOptions = {
    chart: {
      type: 'donut',
      background: '#ffffff', // sets chart background
    },
    labels: [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Beauty',
      'Books',
      'Toys',
      'Grocery',
      'Automotive'
    ],
    legend: {
      position: 'bottom', // moved to bottom
    },
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#81C784', '#BA68C8', '#4DB6AC', '#FF8A65', '#7986CB'],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  const chartSeries = [250, 200, 180, 150, 120, 100, 80, 60]

  return (
    <div className='w-full flex flex-col gap-6   '>
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

      <div className="bg-white rounded-xl p-4 flex justify-center items-center w-full">
        <Chart 
  options={chartOptions} 
  series={chartSeries} 
  type="donut" 
  width="370" 
  height="370" 
/>

      </div>
    </div>
  )
}

export default CategoryChart

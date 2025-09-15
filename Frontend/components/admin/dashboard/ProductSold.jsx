'use client'

import React from 'react'
import { BsBoxSeam } from "react-icons/bs"
import dynamic from 'next/dynamic'
import { useDashboard } from '../../../context/dashboard/DashboardContext'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ProductSold = () => {
  const { weeklySale } = useDashboard();


  const processWeeklyData = () => {
    if (!weeklySale || !Array.isArray(weeklySale)) {
      return {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [0, 0, 0, 0, 0, 0, 0],
        totalSold: 0
      };
    }

    const weeklyData = weeklySale;
    
   
    const categories = weeklyData?.map(day => day.dayName.substring(0, 3));
    
    
    const data = weeklyData?.map(day => day.totalOrders);
    

    const totalSold = data?.reduce((sum, orders) => sum + orders, 0);
    
    return { categories, data, totalSold };
  };

  const { categories, data, totalSold } = processWeeklyData();

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
      categories: categories,
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
    tooltip: { 
      theme: 'light',
      custom: function({ series, seriesIndex, dataPointIndex }) {
        const dayData = weeklySale?.[dataPointIndex];
        return `<div class="px-3 py-2">
          <div class="font-semibold">${dayData?.dayName || categories[dataPointIndex]}</div>
          <div class="text-sm">${dayData?.date || ''}</div>
          <div class="text-sm">Orders: ${series[seriesIndex][dataPointIndex]}</div>
          ${dayData?.isToday ? '<div class="text-xs text-blue-300">Today</div>' : ''}
        </div>`;
      }
    },
    colors: ['#ffffff'],
  }

  const chartSeries = [{
    name: 'Products Sold',
    data: data
  }]

  return (
    <div className='p-8 rounded-xl flex flex-col gap-0 hover:scale-[1.01] hover:shadow-[0_0_18px_#00000018] bg-violet-700/60 transition-all duration-300'>
      <div className="flex flex-col gap-4 items-center justify-center">
        <span className='text-white text-5xl'><BsBoxSeam /></span>
        <h3 className='text-white text-3xl'>Products Sold</h3>
        <span className='text-white font-medium text-lg'>
          {totalSold} Sold
        </span>
        {weeklySale && (
          <span className='text-white/70 text-xs'>
            Last 7 days ending today
          </span>
        )}
      </div>
      <div className='w-full'>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={210}
        />
      </div>
    </div>
  )
}

export default ProductSold
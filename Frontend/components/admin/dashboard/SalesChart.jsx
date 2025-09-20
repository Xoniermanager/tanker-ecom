'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { BsQuestionCircle, BsThreeDots } from 'react-icons/bs'
import { useDashboard } from '../../../context/dashboard/DashboardContext'
import {months} from "../../../constants/enums"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })



const SalesChart = () => {
  const { monthlySaleswithOrder, setSalesQueryMonth, salesQueryMonth } = useDashboard()
  
  // Initialize with current month or October based on your data
  const getCurrentMonthName = () => {
    if (monthlySaleswithOrder && monthlySaleswithOrder.monthName) {
      return monthlySaleswithOrder.monthName
    }
    return 'October' // Default fallback
  }
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName())
  const [salesData, setSalesData] = useState({})


  useEffect(() => {
    if (monthlySaleswithOrder && monthlySaleswithOrder.monthName) {
      setSelectedMonth(monthlySaleswithOrder.monthName)
    }
  }, [monthlySaleswithOrder])

  useEffect(() => {
    if (monthlySaleswithOrder) {
      const formattedData = {
        [monthlySaleswithOrder.monthName]: {
          sales: monthlySaleswithOrder.sales || [],
          orders: monthlySaleswithOrder.orders || [],
          total: monthlySaleswithOrder.total || 0,
          weeks: monthlySaleswithOrder.weeks || []
        }
      }
      setSalesData(formattedData)
    }
  }, [monthlySaleswithOrder])

  // Get current data for selected month
  const getCurrentData = () => {
    if (salesData[selectedMonth]) {
      return salesData[selectedMonth]
    }
    
    // Fallback empty data
    return {
      sales: [0, 0, 0, 0],
      orders: [0, 0, 0, 0],
      total: 0,
      weeks: []
    }
  }

  const data = getCurrentData()

  // Generate week labels dynamically based on data length
  const getWeekCategories = () => {
    if (data.weeks && data.weeks.length > 0) {
      return data.weeks.map((_, index) => `Week ${index + 1}`)
    }
    return data.sales.map((_, index) => `Week ${index + 1}`)
  }

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
      categories: getWeekCategories(),
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
      formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
        if (seriesIndex === 0) {
          return `Sales: $${value?.toLocaleString() || 0}`
        } else {
          return `Orders: ${value || 0}`
        }
      }
    }
  }

  const chartSeries = [
    {
      name: 'Sales ($)',
      data: data.sales
    },
    {
      name: 'Orders',
      data: data.orders
    }
  ]


  return (
    <div className='w-full flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-8'>
        <h2 className='text-2xl font-semibold flex gap-3 items-center'>
          Sales Chart 
          <span className='text-red-500 text-xl cursor-pointer hover:scale-105 transition'>
            <BsQuestionCircle />
          </span>
        </h2>
        {/* <button className='hover:text-orange-500 hover:scale-105 transition'>
          <BsThreeDots />
        </button> */}
      </div>

      <div className='p-8 bg-white rounded-2xl shadow-[0_0_8px_#00000015]'> 
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium'>Select Month:</label>
            <select
              className='border px-3 py-1 rounded-md outline-none text-sm'
              value={salesQueryMonth}
              onChange={(e) => setSalesQueryMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.name}</option>
              ))}
            </select>
          </div>

          <div className='text-sm font-semibold text-green-600'>
            Total Income: 
            <span className='text-black text-base font-bold ml-1'>
              ${data.total?.toLocaleString() || '0'}
            </span>
          </div>
        </div>

        {/* Loading state */}
        {!monthlySaleswithOrder ? (
          <div className='flex justify-center items-center h-[350px]'>
            <div className='text-gray-500'>Loading chart data...</div>
          </div>
        ) : (
          <div className='w-full mt-4'>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type='line'
              height={350}
            />
          </div>
        )}

        {/* Data summary */}
        {/* {monthlySaleswithOrder && (
          <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
            <div className='text-sm text-gray-600 mb-2'>
              <strong>{monthlySaleswithOrder.monthName} {monthlySaleswithOrder.year} Summary:</strong>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
              <div>
                <span className='text-gray-500'>Total Sales:</span>
                <div className='font-semibold text-green-600'>
                  ${monthlySaleswithOrder.total?.toLocaleString() || '0'}
                </div>
              </div>
              <div>
                <span className='text-gray-500'>Total Orders:</span>
                <div className='font-semibold text-blue-600'>
                  {monthlySaleswithOrder.orders?.reduce((sum, count) => sum + count, 0) || 0}
                </div>
              </div>
              <div>
                <span className='text-gray-500'>Weeks Tracked:</span>
                <div className='font-semibold'>
                  {monthlySaleswithOrder.weeks?.length || 0}
                </div>
              </div>
              <div>
                <span className='text-gray-500'>Avg Weekly Sales:</span>
                <div className='font-semibold text-orange-600'>
                  ${monthlySaleswithOrder.weeks?.length > 0 
                    ? Math.round(monthlySaleswithOrder.total / monthlySaleswithOrder.weeks.length).toLocaleString()
                    : '0'
                  }
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default SalesChart
'use client'
import React from 'react'
import { BsQuestionCircle, BsThreeDots } from 'react-icons/bs'
import dynamic from 'next/dynamic'
import { useDashboard } from '../../../context/dashboard/DashboardContext';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CategoryChart = () => {
  const {topSellingCategories} = useDashboard();
  console.log("Top Categories: ", topSellingCategories)
  
  
  const categoriesWithSales = topSellingCategories?.filter(
    category => category?.salesMetrics?.totalRevenue && category?.salesMetrics?.totalRevenue > 0
  );
  
  
  const totalRevenue = categoriesWithSales?.reduce(
    (sum, category) => sum + (category?.salesMetrics?.totalRevenue || 0), 
    0
  );
  

  const chartData = categoriesWithSales?.map(category => ({
    name: category.name,
    revenue: category.salesMetrics?.totalRevenue || 0,
    percentage: ((category.salesMetrics?.totalRevenue || 0) / totalRevenue * 100).toFixed(1)
  }));
  
  const chartOptions = {
    chart: {
      type: 'donut',
      background: '#ffffff', 
    },
    labels: chartData.map(item => `${item.name} (${item.percentage}%)`),
    legend: {
      position: 'bottom',
      fontSize: '14px',
    },
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#81C784', '#BA68C8', '#4DB6AC', '#FF8A65', '#7986CB'],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Revenue',
              formatter: () => `$${totalRevenue.toLocaleString()}`
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value, { seriesIndex }) => {
          const category = chartData[seriesIndex];
          return `$${category.revenue.toLocaleString()} (${category.percentage}%)`;
        }
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
            fontSize: '12px',
          },
        },
      },
    ],
  }


  const chartSeries = chartData.map(item => item.revenue);

  
  if (categoriesWithSales.length === 0) {
    return (
      <div className='w-full flex flex-col gap-6'>
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
        <div className="bg-white rounded-xl p-4 flex justify-center items-center w-full min-h-[400px]">
          <p className="text-gray-500">No sales data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-8'>
        <h2 className='text-2xl font-semibold flex gap-3 items-center'>
          Top Selling Categories
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
      
      
      {/* <div className="bg-white rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chartData.map((category, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium">{category.name}</span>
              <span className="text-sm">
                ${category.revenue.toLocaleString()} ({category.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default CategoryChart
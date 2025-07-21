"use client"
import React from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';

const NewCustomers = () => {
  
  const last7Days = [...Array(7)].map((_, i) =>
    dayjs().subtract(6 - i, 'day').format('MMM D')
  );

 
  const customerCounts = [4, 6, 3, 8, 5, 7, 9];

  const chartOptions = {
    chart: {
      id: 'new-customers-line-chart',
      toolbar: { show: false },
    },
    xaxis: {
      categories: last7Days,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: ['#f97316'], 
    markers: {
      size: 5,
      colors: '#f97316',
      strokeWidth: 2,
      strokeColors: '#fff',
    },
    tooltip: {
      enabled: true,
    },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
    },
  };

  const series = [
    {
      name: 'Customers',
      data: customerCounts,
    },
  ];

  return (
    <div className='bg-white shadow-[0_0_15px_#00000015] p-6 rounded-xl flex flex-col gap-6 hover:scale-104 hover:shadow-[0_0_18px_#00000018] transition'>
      <h3 className='text-2xl font-medium'>New Customers</h3>
      <Chart options={chartOptions} series={series} type="line" height={300} />
    </div>
  );
};

export default NewCustomers;


"use client"
import Image from 'next/image'
import React from 'react'
import { useDashboard } from '../../../context/dashboard/DashboardContext'
import Link from 'next/link'
import PageLoader from '../../common/PageLoader'

const Monitor = () => {
    const {dashboardData} = useDashboard();


    if(!dashboardData){
        return <PageLoader/>
    }

    
  return (
    <>
      <div className='w-full flex-col flex gap-4'>
        <h2 className='text-2xl font-semibold'>Activity Overview</h2>
        <div className="grid grid-cols-4 gap-6">
            <Link href={'/admin/orders'} className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015] hover:scale-104 hover:shadow-[0_0_12px_#00000022]">
                <Image src={'/images/truck-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Delivered</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>{dashboardData?.deliveredOrders?.count || 0} new packages</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div style={{ width: `${Number(dashboardData?.deliveredOrders?.salesPercent) || 0}%` }} className={`absolute left-0 bg-purple-700  z-10 h-1`}></div>
                </div>
                </div>

            </Link>
            <Link href={'/admin/orders'} className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015] hover:scale-104 hover:shadow-[0_0_12px_#00000022]">
                <Image src={'/images/order-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Ordered</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>{dashboardData?.totalOrders?.count || 0} new Orders</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div style={{ width: `${Number(dashboardData?.totalOrders?.salesPercent) || 0}%` }} className={`absolute left-0 bg-orange-400 w-[75%] z-10 h-1`}></div>
                </div>
                </div>

            </Link>
            <Link href={'/admin/orders'} className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015] hover:scale-104 hover:shadow-[0_0_12px_#00000022]">
                <Image src={'/images/report-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Reported</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>{dashboardData?.totalQuery?.count || 0} Support New Cases</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div style={{ width: `${Number(dashboardData?.totalQuery?.queryPercent) || 0}%` }} className={`absolute left-0 bg-cyan-400 w-[55%] z-10 h-1`}></div>
                </div>
                </div>

            </Link>
            <Link href={`/admin/orders`} className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015] hover:scale-104 hover:shadow-[0_0_12px_#00000022]">
                <Image src={'/images/arrived-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Arrived</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>{dashboardData?.arrivedOrders?.count || 0} Upgraded Boxed</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div style={{ width: `${Number(dashboardData?.arrivedOrders?.salesPercent) || 0}%`}} className={`absolute left-0 bg-purple-700 w-[25%] z-10 h-1`}></div>
                </div>
                </div>

            </Link>

        </div>

      </div>
    </>
  )
}

export default Monitor

"use client"
import Link from 'next/link'
import React, {useState} from 'react'
import { motion, useScroll, useTransform } from "framer-motion";
import { BsBasket, BsThreeDots, BsDownload } from "react-icons/bs"
import { RiStarSFill } from "react-icons/ri";
import { GoArrowUp } from "react-icons/go";
import dynamic from 'next/dynamic'


const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const CustomerRating = () => {
     const [specShow, setSpecShow] = useState(false)

     const chartOptions = {
    chart: {
      type: 'line',
      sparkline: { enabled: true },
    },
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    colors: ['#20c997'], 
    tooltip: {
      enabled: false,
    }
  }

  const chartSeries = [
    {
      name: 'Orders',
      data: [280, 100, 190, 290, 110, 305, 415], 
    }
  ]
  return (
    <>
      <Link href={'/dashboard/orders'} className="bg-white shadow-[0_0_15px_#00000015] p-6 rounded-xl flex flex-col  gap-6 hover:scale-104 hover:shadow-[0_0_18px_#00000018]">
      <div className="flex items-center justify-between gap-2">
        <h3 className='text-2xl font-medium'>Customer Rating</h3>
        <div className='relative' onMouseEnter={()=>setSpecShow(true)} onMouseLeave={()=>setSpecShow(false)}><button ><BsThreeDots /></button>
        <motion.ul
         animate={specShow ? {opacity: 1, y: 0, display: "flex"} : {opacity: 0, y: 10, display: "none"}}
         transition={{ duration: .3}}
         viewport={{ once: true }}
        className={` absolute shadow-[0_0_15px_#00000020] bg-white w-42 p-4 z-20 -left-16 px-6 rounded-lg flex flex-col gap-1.5`}>
           <li><Link href={''} className="hover:text-orange-500">View Detail</Link></li>
           <li><button className="hover:text-orange-500">Download</button></li>
        </motion.ul>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col gap-3">
        <h3 className='text-5xl '>3.0</h3>
        <div className="flex items-center justify-center">{[...Array(5)].map((_,index)=>(
            <RiStarSFill key={index} className='text-orange-300 text-2xl' /> 
        ))} (318)</div>
      </div>
      <div className="flex items-center justify-center gap-4"><span className='text-green-500 flex items-center'><GoArrowUp className='wavy'/>+35</span> <span className='text-slate-500'>Point from last month</span></div>
      <div className='flex justify-center'><div className="w-26 h-10">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={40}
            width={120}
          />
        </div></div>
        <div className="flex justify-center">
          <button className='text-orange-500 px-6 py-2.5 border-orange-500 border-1 rounded-lg text-sm flex items-center gap-4 hover:bg-orange-500 hover:text-white'>
            <BsDownload /> Download Report
          </button>
        </div>
      </Link>
    </>
  )
}

export default CustomerRating

'use client'
import React, {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from "framer-motion";

// Icons
import { BsBasket, BsThreeDots, BsCreditCard2Front } from "react-icons/bs"
import { IoIosArrowRoundUp } from "react-icons/io"
import Link from 'next/link';


const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const SalesMonitor = () => {
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
    colors: ['#F97316'], 
    tooltip: {
      enabled: false,
    }
  }

  const chartSeries = [
    {
      name: 'Orders',
      data: [280, 300, 290, 310, 305, 315], 
    }
  ]



  return (
    <Link href={'/dashboard/orders'} className="bg-white shadow-[0_0_15px_#00000015] p-6 rounded-xl flex flex-col gap-4.5 hover:scale-104 hover:shadow-[0_0_18px_#00000018]">
      <div className="flex items-center justify-between gap-2">
        <span className='text-3xl'><BsCreditCard2Front /></span>
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

      <h2 className='text-xl font-semibold'>Sales</h2>

      <div className="flex justify-between items-center gap-2">
        <span className='text-3xl'>$3.759,00</span>
        <div className="w-24 h-10">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={40}
            width={100}
          />
        </div>
      </div>

      <p className='text-green-500 font-medium flex items-center gap-0.5'>
        Over last month 1.4% 
        <IoIosArrowRoundUp className='text-xl wavy'/>
      </p>
    </Link>
  )
}

export default SalesMonitor

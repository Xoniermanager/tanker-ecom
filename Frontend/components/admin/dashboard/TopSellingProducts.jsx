'use client'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { motion } from "framer-motion"
import Link from 'next/link'
import Image from 'next/image'

import { FaEye } from "react-icons/fa";
import { useDashboard } from '../../../context/dashboard/DashboardContext'

const TopSellingProducts = () => {
  const [specShow, setSpecShow] = useState(false);

  const {topSellingProductsData} = useDashboard();

  const products = topSellingProductsData
  const length = topSellingProductsData?.length || 0;

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className="flex items-center justify-between">
        <h2 className='text-2xl font-semibold'>Top Selling Products</h2>
        <div
          className='relative'
          onMouseEnter={() => setSpecShow(true)}
          onMouseLeave={() => setSpecShow(false)}
        >
          <button><BsThreeDots className="text-lg" /></button>
          <motion.ul
            animate={specShow ? { opacity: 1, y: 0, display: "flex" } : { opacity: 0, y: 10, display: "none" }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 mt-2 shadow-[0_0_15px_#00000020] bg-white w-40 p-3 z-20 rounded-md flex flex-col gap-2"
          >
            <li><Link href={''} className="text-sm hover:text-orange-500">View Detail</Link></li>
            <li><button className="text-sm hover:text-orange-500">Download</button></li>
          </motion.ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-[0_0_10px_#00000015] overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wide">
              <th className="py-4 px-4">Product</th>
              <th className="py-4 px-4">Stock Available</th>
              <th className="py-4 px-4">Sales Count</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(length > 0) ? products?.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-all"
              >
                <td className="py-4 px-4">
                  <Link href={`/admin/products/view/${item?.product[0]?.slug}`} className="flex group items-center gap-3.5">
                    <Image
                      src={item?.product[0]?.images[0]?.source || "/images/dummy.jpg"}
                      alt={item?.product[0]?.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover h-12 w-12 group-hover:scale-105"
                    />
                    <span className={`font-medium text-purple-900 group-hover:text-orange-500`}>{item?.product[0]?.name}</span>
                  </Link>
                </td>
                <td className="py-4 px-4  "> <span className={`${(item?.quantity <= 10 ) ? "text-red-500 bg-red-50 animate-pulse" :"text-purple-900 bg-purple-50 pulse"} text-sm px-4 py-2 font-medium tracking-wide rounded-md`}>{item?.quantity} {(item?.quantity <= 10 ) && "left" } </span></td>
                <td className="py-4 px-4 "> <span className='bg-purple-900 px-4 py-1 rounded-md text-white min-w-20 text-md'>{item?.salesCount}</span></td>
                <td className="py-4 px-4 "> <span className='text-white px-2 py-1 text-sm capitalize rounded-lg bg-green-400 tracking-wide '>${item?.product[0]?.sellingPrice?.toFixed(2)}</span></td>
                <td className="py-4 px-4 text-right flex justify-end">
                  <Link href={`/admin/products/view/${item?.product[0]?.slug}`} className="bg-orange-500 text-white text-lg hover:underline hover:bg-orange-600 h-8 w-8 rounded flex items-center justify-center">
                  <FaEye />
                  </Link>
                </td>
              </tr>
            )): (
              <tr className='border-b border-gray-100 hover:bg-gray-50 transition-all'>
                 <td className='p-4 text-center'> Product data not found </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopSellingProducts

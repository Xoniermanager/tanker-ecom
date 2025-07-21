'use client'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { motion } from "framer-motion"
import Link from 'next/link'
import Image from 'next/image'

import { FaEye } from "react-icons/fa";

const TopSellingProducts = () => {
  const [specShow, setSpecShow] = useState(false)

  const products = [
    {
      name: "Wireless Headphones",
      stock: 25,
      price: "$89.99",
      image: "/images/wheel.jpg"
    },
    {
      name: "Smart Watch",
      stock: 12,
      price: "$129.00",
      image: "/images/wheel.jpg"
    },
    {
      name: "Gaming Mouse",
      stock: 45,
      price: "$59.00",
      image: "/images/wheel.jpg"
    },
    {
      name: "Bluetooth Speaker",
      stock: 18,
      price: "$99.50",
      image: "/images/wheel.jpg"
    },
  ]

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
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-all"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-green-500 ">{item.stock}</td>
                <td className="py-4 px-4 ">{item.price}</td>
                <td className="py-4 px-4 text-right flex justify-end">
                  <button className="bg-orange-500 text-white text-lg hover:underline hover:bg-orange-600 h-8 w-8 rounded flex items-center justify-center">
                  <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopSellingProducts

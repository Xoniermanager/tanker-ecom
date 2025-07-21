'use client'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { FaEye } from "react-icons/fa";

const orders = [
  {
    id: '#3210',
    name: 'Cortie Gemson',
    date: 'May 23, 2025',
    total: '$239,00',
    status: 'Processing',
    badgeClass: 'bg-orange-500 text-white',
  },
  {
    id: '#3210',
    name: 'Mathilde Tumilson',
    date: 'May 15, 2025',
    total: '$650,50',
    status: 'Shipped',
    badgeClass: 'bg-zinc-900 text-white',
  },
  {
    id: '#3210',
    name: 'Audrye Heaford',
    date: 'Apr 24, 2025',
    total: '$100,00',
    status: 'Completed',
    badgeClass: 'bg-purple-600 text-white',
  },
  {
    id: '#3210',
    name: 'Brantley Mell',
    date: 'Apr 10, 2025',
    total: '$19',
    status: 'Refunded',
    badgeClass: 'bg-yellow-400 text-black',
  },
  {
    id: '#3210',
    name: 'Dominique Enriques',
    date: 'March 5, 2025',
    total: '$150,00',
    status: 'Cancelled',
    badgeClass: 'bg-red-500 text-white',
  },
  {
    id: '#3210',
    name: 'Dominique Enriques',
    date: 'March 5, 2025',
    total: '$150,00',
    status: 'Cancelled',
    badgeClass: 'bg-red-500 text-white',
  },
  {
    id: '#3210',
    name: 'Dominique Enriques',
    date: 'March 5, 2025',
    total: '$150,00',
    status: 'Cancelled',
    badgeClass: 'bg-red-500 text-white',
  },
]

const OrderlistTable = () => {
  return (
    <div className="min-h-screen bg-[#f4f2ff] p-6">
      
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-black">Orders List</h2>
        <div className="text-sm text-gray-500 mt-1">
          <span className="text-orange-500 mr-1">Dashboard</span> &gt; Orders
        </div>
      </div>

     
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button className="text-sm px-4 py-2 rounded-md ">All Orders</button>

          <select className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-500">
            <option>Sort by</option>
          </select>

          <select className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-500">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 text-sm pl-4 pr-10 py-2 rounded-md w-52"
            />
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-md">
            Actions ⌄
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left border-separate border-spacing-y-4">
          <thead className="bg-[#f4f2ff]  uppercase text-xs">
            <tr>
              <th className="px-6 py-4">
                <input type="checkbox" />
              </th>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {orders.map((order, index) => (
              <tr key={index} className="bg-white rounded-xl overflow-hidden shadow">
                <td className="px-6 py-6">
                  <input type="checkbox" />
                </td>
                <td className="px-6 py-6 text-red-500 font-semibold">{order.id}</td>
                <td className="px-6 py-6">{order.name}</td>
                <td className="px-6 py-6">{order.date}</td>
                <td className="px-6 py-6">{order.total}</td>
                <td className="px-6 py-6">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${order.badgeClass}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-6 text-xl text-gray-500">
                  <button className='flex items-center justify-center h-8 w-8 rounded-lg text-white bg-orange-500'><FaEye /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
<div className="flex justify-between items-center mt-8 flex-wrap gap-4 px-2">
  {/* Results info */}
  <p className="text-sm text-gray-500">
    Showing <strong>1</strong> to <strong>{orders.length}</strong> of <strong>{orders.length}</strong> results
  </p>

  {/* Pagination buttons */}
  <div className="flex items-center gap-1">
    {/* Previous */}
    <button
      disabled
      className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed bg-white"
    >
      Previous
    </button>

    {/* Page numbers */}
    <button className="px-3 py-1.5 text-sm rounded-lg bg-orange-500 text-white font-semibold shadow">
      1
    </button>
    <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
      2
    </button>
    <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
      3
    </button>
    <span className="px-2 text-gray-400 text-sm">...</span>
    <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
      10
    </button>

    {/* Next */}
    <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
      Next
    </button>
  </div>
</div>

      </div>
    </div>
  )
}

export default OrderlistTable

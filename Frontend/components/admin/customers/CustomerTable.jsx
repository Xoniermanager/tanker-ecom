'use client'
import React, { useState, useEffect, useRef } from 'react'
import api from '../../user/common/api'
import DeletePopup from '../common/DeletePopup'
import { IoArrowForward } from "react-icons/io5";
import Image from 'next/image';
import Link from 'next/link';
import PageLoader from '../../common/PageLoader';


const CustomerTable = ({setCurrentPage, isLoading, searchInput, currentPage, handleUserActivate, setPageLimit, setTotalPages, handleUserDeactivate, setSearchInput, pageLimit, totalPages, usersData, handleStatusFilter}) => {
   
  const [menuOpen, setMenuOpen] = useState(null)
  const menuRef = useRef()


  const handlePageLimit = (e)=>{
     setPageLimit(e.target.value);
     setCurrentPage(1)
  }

  


  return (
    <>
 
    <div className="min-h-screen">

      <div className="flex bg-white p-4 rounded-xl justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-2">
          {/* <select className="px-4 py-2 border border-slate-300 rounded-lg">
            <option>Sort by</option>
          </select> */}
          <select value={pageLimit} onChange={handlePageLimit} className="px-4 py-2 outline-none border border-slate-300 rounded-lg">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
          <select onChange={handleStatusFilter} className="px-4 py-2 outline-none border border-slate-300 rounded-lg">
            <option value="" >All</option>
            <option value={'active'}>Active</option>
            <option value={'inactive'}>Inactive</option>
            
          </select>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e)=>setSearchInput(e.target.value)}
              placeholder="Search by name"
              className="px-4 py-2 border border-slate-300 rounded-lg outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
          </div>
        </div>
        {/* <button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-sm">
          Actions
        </button> */}
      </div>

      <table className="w-full rounded-xl">
        <thead className="text-gray-700 text-[12px] uppercase">
          <tr className="text-left">
            
          
            <th className="p-4">PHOTO</th>
            <th className="p-4">FULLNAME</th>
            <th className="p-4">EMAIL</th>
            <th className="p-4">COUNTRY</th>
           
            <th className="p-4">STATUS</th>
            <th className="p-4">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-transparent">
          {!isLoading ? (usersData?.length > 0 ? usersData?.map((customer) => (
            <tr
              key={customer._id}
              className="bg-white hover:bg-gray-50 transition-all rounded-xl shadow-sm my-2"
            >
            
          
              <td className="p-4">
                <Link href={`customers/${customer._id}`} className='h-12 w-12 group flex items-center justify-center rounded-full overflow-hidden'>
                <Image src={customer?.profileImage || "/images/admin-avatar.png"} height={40} width={40} alt='PROFILE IMAGE' className='object-cover object-center h-12 w-12 group-hover:scale-115'/>
                </Link>
                
              </td>
              <td className="p-4 "><Link href={`customers/${customer._id}`} className='hover:text-orange-500'> {customer?.fullName}</Link></td>
              <td className="p-4 text-red-500">{customer?.companyEmail}</td>
              <td className="p-4"><span className='capitalize'>{customer.country}</span></td>
             
              <td className="p-4">
                <span
                  className={`text-white text-xs font-semibold py-1 px-3 rounded-full capitalize ${
                    customer.status === 'active' ? 'bg-green-600' : 'bg-red-500'
                  }`}
                >
                  {customer.status}
                </span>
              </td>
              <td className="p-4 relative border-none" ref={menuRef} onMouseLeave={()=>setMenuOpen(null)}>
                <span
                  className="cursor-pointer text-xl"
                  onMouseEnter={() => setMenuOpen(menuOpen === customer._id ? null : customer._id)}
                >
                  ⋯
                </span>
                {menuOpen === customer._id && (
                  <div className="absolute z-10 right-2 mt-2 w-40 bg-white flex flex-col shadow-[0_0_15px_#00000020] rounded-lg  py-2 text-sm">
                    <Link href={`customers/${customer._id}`} className="w-full text-left px-4 py-2 hover:bg-gray-100">Show Profile</Link>
                    {/* <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Edit</button> */}
                   {(customer.status === "active") ? <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={()=>handleUserDeactivate(customer._id, customer.fullName)}>Deactivate Account</button> : <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-500" onClick={()=>handleUserActivate(customer._id, customer.fullName)}>Activate Account</button> }
                  </div>
                )}
              </td>
            </tr>
          )): <tr className='bg-white hover:bg-gray-50 transition-all rounded-xl shadow-sm my-2'> <td className='p-4 relative border-none text-center' colSpan={6}>  Data not found</td> </tr> ): (
            <>
            <tr className='bg-white hover:bg-gray-50 transition-all rounded-xl shadow-sm my-2'> <td className='p-4 relative border-none text-center' colSpan={6}>  Loading... </td> </tr>
            </>
          ) }
        </tbody>
      </table>
      <div className="flex items-center gap-4 justify-center mt-6">
                              {[...Array(totalPages)].map((item, index) => (
                                <button
                                  className={` ${
                                    currentPage === index + 1
                                      ? "bg-orange-400 text-white"
                                      : "bg-[#f6e7d3]"
                                  } hover:bg-orange-400 hover:text-white  h-12 w-12 rounded-full border-white text-purple-950  font-bold border-1 border-dashed text-lg`}
                                  key={index}
                                  onClick={() => setCurrentPage(index + 1)}
                                >
                                  {index + 1}
                                </button>
                              ))}
                              <button
                                disabled={
                                  usersData?.length <= 0 ||
                                  Number(totalPages) === Number(currentPage)
                                }
                                className={`h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] disabled:bg-[#507b86c5] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl ${
                                  usersData?.length <= 0 && "hidden"
                                }`}
                                onClick={() => setCurrentPage(Number(currentPage) + 1)}
                              >
                                {" "}
                                <IoArrowForward />{" "}
                              </button>
                            </div>
    </div>
    </>
  )
}


export default CustomerTable

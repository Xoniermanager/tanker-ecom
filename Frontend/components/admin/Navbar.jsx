"use client"
import React, { useState } from 'react'
import { IoIosSearch, IoIosNotificationsOutline } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { GoPlusCircle } from "react-icons/go";
import NotificationSidebar from './common/NotificationSidebar';
import { toast } from 'react-toastify';
import Link from 'next/link';

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false)



  return (
    <>
       <NotificationSidebar showNotification={showNotification} setShowNotification={setShowNotification}/>
      <div className='fixed top-0 p-5 z-99 w-full pl-84 bg-violet-50 flex items-center gap-4'>
        <div className="w-[70%]">
            <div className="bg-white p-2 px-5 rounded-lg flex items-center gap-4 shadow-[0_0_8px_#00000010]">
                <IoIosSearch className='text-xl'/>
                <input type="text" className='outline-none border-none w-full' placeholder='Search...' />
            </div>
        </div>
        <div className='w-[30%] flex items-center justify-end gap-7'> 
           <button className="relative cursor-pointer group" onClick={()=>setShowNotification(true)}>
               <span className='text-2xl group-hover:text-orange-600'><IoIosNotificationsOutline /></span>
               <span className='bg-red-500 h-4 w-4 flex rounded-full items-center justify-center text-white absolute -top-1.5 -right-1 text-[10px]'> 2</span>
           </button>
           {/* <button className="relative cursor-pointer group" onClick={()=>toast.info("Sorry Admin service is under development")}>
               <span className='text-2xl group-hover:text-orange-600'><IoCartOutline /></span>
               <span className='bg-red-500 h-4 w-4 flex rounded-full items-center justify-center text-white absolute -top-1.5 -right-1 text-[10px]'> 2</span>
           </button> */}
           <Link href={'/admin/products/add-product'} className='bg-orange-500 flex items-center gap-3 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600' >
           <GoPlusCircle /> Add Product
           </Link>
        </div>

       
      </div>
    </>
  )
}

export default Navbar

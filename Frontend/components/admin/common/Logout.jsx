
import React from 'react'
import { FaXmark } from "react-icons/fa6"
import { IoMdLogOut } from "react-icons/io";



const Logout = ({ logout, isLoading, close }) => {
  
  

  return (
    <>
      <div className='fixed w-full h-full top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-black/10 z-149' onClick={close}></div>
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] bg-white flex flex-col gap-3 p-6 px-10 rounded-lg z-151'>
        <button className='absolute right-2.5 top-2.5 hover:rotate-90 hover:text-red-500' onClick={close}>
          <FaXmark className='text-xl' />
        </button>
        <h2 className='text-2xl font-semibold text-purple-950'>Are you sure you want to logout?</h2>
        <div className="flex justify-end items-center gap-3">
          <button
          disabled={isLoading}
            className='bg-red-500 hover:bg-red-600 disabled:bg-red-300 px-6 py-2 text-white rounded-lg font-medium flex items-center gap-1.5' 
            onClick={logout}
          >
           {isLoading ? 'Requesting...' : 'Logout' } <IoMdLogOut />
          </button>
        </div>
      </div>
    </>
  )
}

export default Logout

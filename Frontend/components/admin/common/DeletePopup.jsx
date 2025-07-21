import React from 'react'
import { FaXmark } from "react-icons/fa6";

const DeletePopup = ({message, onCancel, onDelete, isLoading, errMessage}) => {
  return (
    <>
      <div className='w-full backdrop-blur-md fixed top-0 left-0 right-0 bottom-0 z-150 h-full' onClick={onCancel}></div>
      <div className='bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-8 px-10 z-200 shadow-[0_0_18px_#00000020] w-2/5 rounded-lg flex flex-col gap-5 ' >
         <button className='hover:text-red-500 hover:rotate-90 absolute top-3 right-3 text-xl' onClick={onCancel}><FaXmark /></button>
         <h3 className='text-xl font-medium '><span className='text-red-500'>*</span>{message}</h3>
         {errMessage && <div className="flex justify-end"><p className='text-red-500 text-sm'>{errMessage}</p></div>}
         <div className="flex justify-end gap-3"> <button className='bg-red-400 px-5 py-2 text-white rounded-lg' onClick={onDelete}> {isLoading ? "Deleting" :"Delete"}</button> <button className='bg-green-400 px-5 py-2 text-white rounded-lg' onClick={onCancel}>Cancel</button> </div>
      </div>
    </>
  )
}

export default DeletePopup

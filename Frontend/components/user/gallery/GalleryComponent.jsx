"use client"
import React, {useState, useEffect} from 'react'
import { FaCircleArrowRight } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";

const GalleryComponent = ({blogData, currentPage, totalPages}) => {
  
    
  return (
    <>
      <div  className="py-28 max-w-7xl mx-auto flex flex-col gap-12">
        <div className='w-full grid grid-cols-3 gap-7'>
        {blogData?.map((item, index)=>(
           <div style={{backgroundImage:`url(${item.image.fullUrl})`}} className='p-6 w-full h-[450px] hover:-translate-y-3 flex items-end bg-cover bg-center bg-no-repeat group' key={index}>
            <div className="flex flex-col items-center gap-3 w-full group-hover:bg-orange-300/40 bg-blur p-3 py-6">
                 <span className='text-white capitalize bg-orange-400 px-2 font-semibold'>{item.tags}</span>
                 <h2 className='text-white font-bold text-2xl text-center w-[88%]'>{item.title}</h2>
            </div>

           </div>
        ))}
        
        </div>
        <div className="flex items-center gap-4 justify-center w-full">
        
                {[...Array(totalPages)].map((item, index)=>(
                    <button className={` ${currentPage === (index + 1) ? "bg-orange-400 text-white" : "bg-[#f6e7d3]"} hover:bg-orange-400 hover:text-white  h-12 w-12 rounded-full border-white text-purple-950 font-bold border-1 border-dashed text-lg`} key={index}>{index + 1}</button>
                ))}
                <button disabled={totalPages < 2} className="h-12 w-12 rounded-full border-white bg-[#42666f] disabled:bg-[#42666f68] hover:bg-[#334f56] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl" > <IoArrowForward /> </button>
                </div>
      </div>
    </>
  )
}

export default GalleryComponent

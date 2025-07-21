'use client'
import Link from 'next/link'
import React from 'react'
import { IoIosGlobe } from "react-icons/io";
import { usePathname } from 'next/navigation';

const PageBar = ({heading}) => {
    const pathname = usePathname().split('/').pop()
  return (
    <>
      <div className='w-full flex flex-col'>
         <h2 className='text-2xl font-semibold capitalize '>{heading}</h2>
         <div className="flex items-center gap-2 text-gray-500 capitalize">
            <Link href={'/dashboard'} className='text-orange-500 flex items-center gap-1 font-medium'><IoIosGlobe /> Dashboard</Link>
            &gt;
            <span className='capitalize font-medium text-[15px]'>{pathname}</span>
         </div>
      </div>
    </>
  )
}

export default PageBar

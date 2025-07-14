"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const PageBanner = ({heading}) => {
    const pathname = usePathname();
   
    const route = pathname.split("/").pop()
    
  return (
    <>
      <div style={{backgroundImage: 'url("/images/page-banner.jpg")'}} className=' w-full bg-center  bg-cover page-banner relative overflow-hidden'>
         <div className='line-wrapper relative py-46 z-1'>
            <div className='max-w-7xl mx-auto flex flex-col gap-4'>

          <div className='text-white font-semibold text-xl capitalize'> <Link href={'/'} className='hover:text-orange-400'>Home</Link> - {route}</div> 
          <h1 className='text-white font-black text-6xl capitalize'>{heading}</h1>
            </div>
         </div>
         <Image  src={'/images/page-banner-shape.png'} width={500} className='w-full absolute bottom-0 top-4 right-0 left-0 z-0' height={500} alt='shape '/> 
      </div>
    </>
  )
}

export default PageBanner

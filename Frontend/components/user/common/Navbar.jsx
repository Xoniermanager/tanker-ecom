'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, {useState, useEffect} from 'react'
import { FaFacebookF, FaRegEnvelope } from "react-icons/fa";
import { FaRegClock, FaXmark } from "react-icons/fa6";
import { FiPhoneCall } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { usePathname } from 'next/navigation';

const Navbar = () => {

 
  const pathname = usePathname();


  
  return (
    <>
      
      <div className='w-full bg-white shadow-[5px_0_20px_#00000025] '>
        <div className=" bg-purple-950 py-2.5" >
            <div className='max-w-full px-8 mx-auto flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Link href={'/'} className='text-white'> <FaFacebookF /> </Link>
                     <span className='h-[20px] border-r-1 border-white'></span>
                     <Image
                     src={'/images/box.png'} 
                     width={20}
                     height={20}
                     alt='box'
                     /> 
                     <span className='text-white'>Tanker Solutions NZ-made and international offerings</span>
                </div>
                <Link href={'tel:+64274281896'} className='flex items-center gap-4 group'>
                <span className='h-11 w-11 bg-black rounded-full text-white flex items-center justify-center text-2xl '> <FiPhoneCall /> </span>
                <div className='flex flex-col gap-0'>
                    <h4 className='uppercase font-semibold text-white'>support</h4>
                    <p className='group-hover:text-orange-400 text-white'>+64 27428 1896</p>
                </div>

             </Link>
               
            </div>
        </div>
      <div className='max-w-full px-8 py-3 flex items-center sticky top-0 left-0 z-[500] bg-white mid-nav'>


          <div className="w-[20%]">
            <Link href={'/'}>
            <Image
            src={'/images/tanker-solution-logo.png'}
            width={190}
            height={120}
            alt='logo'
            /></Link>
          </div>
          <div className="w-[45%]">
             <nav>
            <ul className="flex items-start justify-start gap-6">
              <li>
                 <Link href={'/'} className={`${pathname === "/" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                 Home
                 </Link>
                 
              </li>
              <li>
                 <Link href={'/about'} className={`${pathname === "/about" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                 About Us
                 </Link>
              </li>
              <li>
                <Link href={'/products'} className={`${pathname === "/products" && "text-orange-400"} text-neutral-900  text-lg hover:text-orange-400`}>
                 Product
                 </Link>
              </li>
              <li>
                <Link href={'/news'} className={`${pathname === "/news" && "text-orange-400"} text-neutral-900  text-lg hover:text-orange-400`}>
                 News Feed
                 </Link>
              </li>
              <li><Link href={'/gallery'} className={`${pathname === "/gallery" && "text-orange-400"} text-neutral-900  text-lg hover:text-orange-400`}>
                 Gallery
                 </Link></li>
              <li><Link href={'/contact'} className={`${pathname === "/contact" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                 Contact Us
                 </Link></li>
            </ul>
          </nav>
          </div>
          <div className="w-[35%] flex items-center justify-end gap-5">
             
             <Link href={'/login'} className='btn-one font-semibold'>
             B2B Login
             </Link>
             <Link href={'/signup'} className='btn-two font-semibold'>
             Sign Up
             </Link>

          </div>
         
        </div>

      </div>
    </>
  )
}

export default Navbar

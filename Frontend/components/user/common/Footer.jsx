"use client"
import Link from 'next/link'
import React, {useState, useEffect} from 'react'

import { FiPhoneCall } from "react-icons/fi";
import { FaFacebookF, FaPaperPlane, FaRegEnvelope } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import Image from 'next/image';

const Footer = () => {
    const [email, setEmail] = useState("")

    const handleSubmit = ()=>{

    }
  return (
    <div style={{backgroundImage: "url('/images/footer-img.jpg')"}} className='w-full py-28 pb-16 footer relative'>
        <div className='flex  gap-12 max-w-7xl mx-auto relative z-20'>
            <ul className="bg-black px-6 py-12 flex flex-col gap-7 w-[28%]">
                <li className='flex items-center gap-3 text-white' > <span className='min-w-8 text-2xl'> <FiPhoneCall /> </span> <div className="flex flex-col gap-1">
                    <Link href={"tel:+64 4 027 428 1896"}>+64 4 027 428 1896</Link> <Link href={"tel:+64 4 027 428 8265"}> +64 4 027 428 8265</Link></div>  </li>
               <li className='flex items-center gap-3 text-white' >
                <Link href={''} className='text-white flex items-center gap-3'> <span className='min-w-8 text-2xl'><IoLocationOutline /></span>
                   8-10 Makaro Street, Porirua, 5022, NEW ZEALAND

                </Link>
               </li>
               <li><Link href={""} className='h-9 w-9 bg-white rounded-full flex items-center justify-center hover:bg-orange-400 hover:text-white hover:scale-105'><FaFacebookF /></Link></li>

            </ul>

            <div className=" flex flex-col gap-6 w-[22%]">
                <h4 className='text-[22px] font-semibold capitalize text-white tracking-wide'>Latest post</h4>
                <div className="flex flex-col gap-2">
                    <span className='text-white/70'>25 August 2025</span>
                    <Link href={''} className='text-white font-semibold text-lg hover:underline'>
                    Meet the Team: 100+ Years of Fuel Industry Experience Under One Roof
                    </Link>
                </div>
                <span className='w-full border-b-1 border-white/40'></span>
                <div className="flex flex-col gap-2">
                    <span className='text-white/70'>25 August 2025</span>
                    <Link href={''} className='text-white font-semibold text-lg hover:underline'>
                    Meet the Team: 100+ Years of Fuel Industry Experience Under One Roof
                    </Link>
                </div>
            </div>
            <div className='flex flex-col gap-6 w-[20%]'>
             <h4 className='text-[22px] font-semibold capitalize text-white tracking-wide'>Services</h4>
            <ul className='flex flex-col gap-2'>
                <li><Link href={'/services'} className='text-white tracking-wide hover:text-orange-400 leading-7'>Specialist Fuel System Design</Link></li>
                <li><Link href={''} className='text-white tracking-wide hover:text-orange-400 leading-7'>Specialist Welding and Vehicle Fabrication</Link></li>
                <li><Link href={''} className='text-white tracking-wide hover:text-orange-400 leading-7'>Final assembly and certification</Link></li>
                <li><Link href={''} className='text-white tracking-wide hover:text-orange-400 leading-7'>Laser Cutting Services</Link></li>
                <li><Link href={''} className='text-white tracking-wide hover:text-orange-400 leading-7'>Testing, Inspection and Compliance</Link></li>
            
            </ul>
            </div>

            <div className='flex flex-col gap-6 w-[30%]'>
                <h4 className='text-[22px] font-semibold capitalize text-white tracking-wide'>Newsletter</h4>
                <p className=' text-white'>Get the latest news, tips and latest messages, including special offers</p>
                <form className='bg-black px-4 py-2 flex items-center' onSubmit={handleSubmit}>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} className='outline-none w-full text-white border-white' placeholder='Enter your email' />
                <button type="submit" className='bg-orange-400 p-3 group'> <FaPaperPlane className='text-lg group-hover:rotate-25'/></button>
               
            </form>
            <Link href={'mailto:sales@tankersolutions.co.nz'} className="flex items-center gap-4 bg-[#222627] text-white font-semibold hover:underline group rounded-lg overflow-hidden hover:text-orange-100"><span className='bg-orange-400 h-11 w-11 flex items-center text-lg justify-center '><FaRegEnvelope className='group-hover:scale-110'/></span> sales@tankersolutions.co.nz  </Link>
            </div>
           
            


        </div>
        <div className='border-t-[1] border-white/50 mt-24 pt-16 max-w-7xl mx-auto relative z-2 flex justify-center'>
           
            <p className='text-white'>&copy; 2025 All Rights Reserved</p>
            <Image src={'/images/gaddi.png'}  width={70} height={70} alt='car' className='absolute left-right -top-19'/>
        </div>
      
    </div>
  )
}

export default Footer

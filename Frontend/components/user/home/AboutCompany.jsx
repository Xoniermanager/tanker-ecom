import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { FiPhoneCall } from "react-icons/fi";

import { FaCheckCircle } from "react-icons/fa";

const AboutCompany = () => {
  return (
    <div className='bg-[#f2edf6] py-28 relative'>
        <div className="max-w-7xl mx-auto flex items-center  gap-16 relative z-1">
            <div className="w-[45%] relative">
                <video className='rounded-2xl w-[95%]' autoPlay muted loop>
                    <source  src='/videos/about-video.mp4'/>
                </video>
                <div className="h-20 w-20 absolute -top-9 -right-4 rounded-full bg-orange-400 text-white text-4xl font-bold flex items-center justify-center"> 18 </div>
            </div>
            <div className="w-[55%] flex flex-col gap-4">
               <div className='flex items-center gap-2'><h4 className='text-orange-400 font-black text-lg uppercase'>About Company </h4> <Image src={'/images/arrows.png'} height={11} width={43} alt='arrrow'/></div>
               <h2 className='font-black text-7xl text-purple-950'> About Us</h2>
               <p className='text-zinc-500   text-lg font-medium'> Tanker Solutions Ltd is New Zealand's leading supplier of tankers and tank trailers to the New Zealand petroleum industry. We can supply anything from a dustcap to a complete turnkey new built tanker and trailer ready to take to the road, fully certified to deliver fuel.</p>

               <ul className='mt-5 flex flex-col gap-5'>
                <li className=' text-purple-950 font-semibold text-lg flex gap-2'> <span className='text-purple-950 text-xl mt-1.5'><FaCheckCircle /> </span> We also have the expertise and equipment to undertake a wide range of light engineering with access to independent certifying engineers where required.</li>
                <li className=' text-purple-950 font-semibold text-lg flex gap-2'> <span className='text-purple-950 text-xl mt-1.5'><FaCheckCircle /> </span> Tanker solutions was founded in April 2007 by Mark and Robyn Wilkin when they recognised the need for an independent customer focused tankwagon constructor based in Wellington.</li>
                <li className=' text-purple-950 font-semibold text-lg flex gap-2'> <span className='text-purple-950 text-xl mt-1.5'><FaCheckCircle /> </span> At Tanker Solutions we are proud of our friendly and efficient customer service, quality products, competitive pricing and speedy delivery.</li>
               </ul>

               <div className='flex items-center gap-6 mt-8'>
                 <Link href={'tel:+6442374555'} className='flex items-center gap-4 group'>
                <span className='h-16 w-16 bg-purple-950 rounded-full text-white flex items-center justify-center text-3xl '> <FiPhoneCall /> </span>
                <div className='flex flex-col gap-0.5'>
                    <h4 className='uppercase font-bold text-orange-400'>Have Question</h4>
                    <p className='text-purple-950 group-hover:text-orange-400 font-bold text-xl'>+64 4 237 4555</p>
                </div>

             </Link>
             <div>

             </div>
             <Link style={{fontWeight: 600}} href={'/about'} className='btn-one '>
               Read More
             </Link>
            </div>
            <p className='text-zinc-500 font-medium text-lg leading-8 group-hover:text-white pt-8'>The Tanker Solutions team has collectively amassed over 100 years experience in servicing the New Zealand petroleum industry and has fully embraced modern technology and has the strategic backing of leading international suppliers of petroleum equipment.</p>
            </div>
            
            
        </div>
        <Image src={'/images/boxes.png'} height={150} width={150} alt='boxes' className='boxes-anim absolute top-1/3 right-6 '/>
        <Image src={'/images/plane.png'} height={190} width={230} alt='boxes' className=' absolute top-2/3 right-16 '/>
      
    </div>
  )
}

export default AboutCompany

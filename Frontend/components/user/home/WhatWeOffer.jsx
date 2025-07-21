import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const WhatWeOffer = () => {
  return (
    <div className='w-full py-28'>
        <div className="max-w-7xl mx-auto flex flex-col gap-12 ">
            <div className="flex flex-col gap-4 items-center">
                <div className='flex items-center gap-2'>
                    <Image src="/images/arrows.png" width={43} height={11} alt='arrow' />
                    <span className='text-orange-400 font-semibold text-[22px]'>WHAT WE OFFER</span>
                    <Image src="/images/arrows.png" width={43} height={11} alt='arrow' />
                </div>
                <h2 className='font-black text-7xl text-purple-950'>Our Services</h2>
                <p className='text-zinc-500 w-1/2 text-center text-lg font-medium'>Tanker Solutuions provides a comprehensive range of services for tanker
fleet owners and operators:</p>
            </div>
            <div className="grid grid-cols-3 gap-8 justify-items-center">
                <div className=' px-10 py-16 w-full  service-box overflow-hidden relative group'>
                  <Link href={''} className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white'>Specialist Welding and Vehicle Fabrication</h2>
                    <p className='text-zinc-500 font-medium text-center leading-8 group-hover:text-white'> Including new chassis building, chassis extensions,
								5th wheel installations and tank remounts - all to the highest industry standards.
							</p>
                    </Link>
                </div>
                <div className=' px-10 py-16 w-full service-box overflow-hidden relative group'>
                  <Link href={''} className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white'>Final assembly and certification</h2>
                    <p className='text-zinc-500 font-medium text-center leading-8 group-hover:text-white'> We make sure everything on your vehicle is ready to start delivering fuel, including all necessary certification. We'll even make your driver a cup of tea to send him on his way.
							</p>
                    </Link>
                </div>
                <div className=' px-10 py-16 w-full service-box overflow-hidden relative group'>
                  <Link href={''} className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white'>Aluminium and Brass Casting</h2>
                    <p className='text-zinc-500 font-medium text-center leading-8 group-hover:text-white'> Our sister company, Neales Foundry (2016) Limited, can cast and manufacture most things in aluminium or bronze. Please call Daniel on 021 262 8784 for further information.
							</p>
                    </Link>
                </div>
            </div> <div className="flex  gap-8 items-center justify-center">
                <div className=' px-10 py-16 w-1/3  service-box overflow-hidden relative group'>
                  <Link href={''} className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white'>Specialist Fuel System Design</h2>
                    <p className='text-zinc-500 font-medium text-center leading-8 group-hover:text-white'> With our years of industry experience there is no fuel transport and handling problem that we cannot design a solution for. We have in the past developed innovative fuel handling solutions for demanding military and aviation clients. Independent registered engineers validate our designs to the required standards
								where required.
							
							</p>
                    </Link>
                </div>
                <div className=' px-10 py-16 w-1/3 service-box overflow-hidden relative group'>
                  <Link href={''} className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white'>Testing and inspection</h2>
                    <p className='text-zinc-500 font-medium text-center leading-8 group-hover:text-white'> With our years of industry experience there is no fuel transport and handling problem that we cannot design a solution for. We have in the past developed innovative fuel handling solutions for demanding military and aviation clients. Independent registered engineers validate our designs to the required standards
								where required.
							
							</p>
                    </Link>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default WhatWeOffer

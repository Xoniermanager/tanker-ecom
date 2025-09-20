import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const WhatWeOffer = ({serviceData}) => {
  const para = serviceData?.contents?.find(item=> item.type === "text").text
  const cardsData = serviceData?.contents?.find(item=> item.type === "cards").contents.sort((a,b)=> a.order - b.order)
  return (
    <div className='w-full py-22 md:py-28 px-6'>
        <div className="max-w-7xl mx-auto flex flex-col gap-12 ">
            <div className="flex flex-col gap-4 items-center">
                <div className='flex items-center gap-2'>
                    <Image src="/images/arrows.png" width={43} height={11} alt='arrow' />
                    <span className='text-orange-400 font-semibold md:text-xl lg:text-[22px] uppercase'>{serviceData?.subheading || "N/A"}</span>
                    <Image src="/images/arrows.png" width={43} height={11} alt='arrow' />
                </div>
                <h2 className='font-black text-5xl lg:text-7xl text-purple-950 capitalize'>{serviceData?.heading || "N/A"}</h2>
                <p className='text-zinc-500 w-[90%] md:w-1/2 text-center md:text-lg font-medium first-letter:uppercase'>{para || "N/A"}</p>
            </div>
            <div className="flex item-center justify-center flex-wrap gap-8 justify-items-center">
              {cardsData?.map((item, i)=>(
              <div key={item.order} className='w-full md:w-[47%] lg:w-[31%] px-8 md:px-10 py-12 md:py-16   service-box overflow-hidden relative group'>
                  <div className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white capitalize'>{item?.title || "N/A"}</h2>
                    <p className='text-zinc-500 font-medium text-center leading-7 md:leading-8 group-hover:text-white'> {item?.description || "N/A"}
							</p>
                    </div>
                </div>
              ))
                
}
                {/* <div className=' px-10 py-16 w-full service-box overflow-hidden relative group'>
                  <Link href={''} className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white'>Final assembly and certification</h2>
                    <p className='text-zinc-500 font-medium text-center leading-8 group-hover:text-white'> We make sure everything on your vehicle is ready to start delivering fuel, including all necessary certification. We'll even make your driver a cup of tea to send him on his way.
							</p>
                    </Link>
                </div> */}
                {/* <div className=' px-10 py-16 w-full service-box overflow-hidden relative group'>
                  <Link href={''} className='flex flex-col justify-center items-center gap-4 '>
                    <h2 className='text-2xl font-black text-purple-950  text-center group-hover:text-white'>Aluminium and Brass Casting</h2>
                    <p className='text-zinc-500 font-medium text-center leading-8 group-hover:text-white'> Our sister company, Neales Foundry (2016) Limited, can cast and manufacture most things in aluminium or bronze. Please call Daniel on 021 262 8784 for further information.
							</p>
                    </Link>
                </div> </div>*/}
             
        </div>
        </div>
      
    </div>
  )
}

export default WhatWeOffer

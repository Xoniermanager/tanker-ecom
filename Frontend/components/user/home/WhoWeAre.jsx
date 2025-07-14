import Image from 'next/image'
import React from 'react'

const WhoWeAre = () => {
  return (
    <>
      <div className='w-full py-28 relative'>
        <div className="max-w-7xl mx-auto flex items-center gap-12">
            <div className="w-1/2 flex flex-col gap-3">
              <div className='flex items-center gap-2'> 
                <h4 className='text-lg font-bold text-orange-400 uppercase'>Who we are</h4>
                <Image src={'/images/arrows.png'} width={43} height={11}/></div>
                <h2 className='font-black text-7xl text-purple-950'>Fueling New Zealand — One Tanker at a Time</h2>
                <p className='text-zinc-500  mt-8 text-lg font-medium'>At Tanker Solutions, we put your transport and delivery needs first. With a focus on reliability and performance, our mission is to deliver certified, road-ready tankers that meet the highest safety and compliance standards — every time.</p>

                <ul className='flex flex-col gap-8 mt-8'>
                    <li className='flex items-start gap-7'>
                       <span className='border-1 border-stone-200 rounded-full h-20 min-w-20 w-20 flex items-center justify-center bg-[#ecfbfe]'><Image src={'/images/icon_1.png' } height={50} width={50}/></span>
                       <div className="flex flex-col gap-3">
                          <h4 className='text-purple-950 font-black text-2xl'>Custom Tankers & Trailers</h4>
                          <p className='text-zinc-500 w-[65%] leading-7 font-medium'>Complete end-to-end solutions for fuel and dry bulk transport — from design and fabrication to certification and delivery.</p>
                       </div>
                    </li>
                    <li className='flex items-start gap-7'>
                       <span className='border-1 border-stone-200 rounded-full h-20 min-w-20 w-20 flex items-center justify-center bg-[#ecfbfe]'><Image src={'/images/icon_2.png' } height={50} width={50}/></span>
                       <div className="flex flex-col gap-3">
                          <h4 className='text-purple-950 font-black text-2xl'>Bulk Fuel Transport Solutions</h4>
                          <p className='text-zinc-500 w-[65%] leading-7 font-medium'>Built to handle high-volume petroleum logistics with durability, compliance, and efficiency in mind.</p>
                       </div>
                    </li>
                    <li className='flex items-start gap-7'>
                       <span className='border-1 border-stone-200 rounded-full h-20 min-w-20 w-20 flex items-center justify-center bg-[#ecfbfe]'><Image src={'/images/icon_3.png' } height={50} width={50}/></span>
                       <div className="flex flex-col gap-3">
                          <h4 className='text-purple-950 font-black text-2xl'>Precision Engineering & Support</h4>
                          <p className='text-zinc-500 w-[65%] leading-7 font-medium'>Smart, modern systems powered by decades of industry expertise and backed by world-class suppliers like HEIL.</p>
                       </div>
                    </li>
                </ul>
            </div>
            <div className="w-1/2">
            <Image className='w-full rounded-[58px] rounded-tr-[0]' 
                src={'/images/truck.jpg'} width={200} height={200} alt='truck'
              /></div>
        </div>
        <Image src={'/images/shape_2.png'} className='absolute top-0 right-0 z-[-1]' width={230} height={230} alt='shape'/>
        <Image src={'/images/shape_1.png'} className='absolute bottom-0 right-0 z-[-1]' width={600} height={400} alt='shape'/>
      </div>
    </>
  )
}

export default WhoWeAre

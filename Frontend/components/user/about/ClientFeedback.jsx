'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { GoDotFill } from "react-icons/go";

const ClientFeedback = () => {
  const [show, setShow] = useState(0);

  const data = [
    {
      para: " We needed urgent repairs and pressure testing on two tankers. The team at Seaview got us back on the road fast, without cutting corners. Their attention to safety and compliance is second to none.",
      name: "Dave M.",
      designation: "Fuel Distribute Lead"
    },
    {
      para: " We've worked with Mark and the team for over 10 years. Their workmanship, industry knowledge, and commitment to NZ fuel transport standards are why we trust them time and again.",
      name: "Tony W.",
      designation: "Depot Supervisor"
    },
    {
      para: " We needed urgent repairs and pressure testing on two tankers. The team at Seaview got us back on the road fast, without cutting corners. Their attention to safety and compliance is second to none.",
      name: "Dave M.",
      designation: "Fuel Distribute Lead"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(prev => (prev + 1) % data.length);
    }, 4000);

    return () => clearInterval(interval); 
  }, [data.length, show]);

  return (
    <>
      <div style={{ backgroundImage: 'url("/images/feedback-bg.jpg")' }} className="py-28 w-full">
        <div className="max-w-7xl mx-auto flex items-center gap-12">
          <div className="w-[42%] flex flex-col gap-8">
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <h4 className='text-orange-400 font-black text-lg uppercase'>Client Feedback </h4>
                <Image src={'/images/arrows.png'} height={11} width={43} alt='arrow' />
              </div>
              <h2 className='font-black text-6xl text-purple-950'> Words from Our Customers Trust Our Client</h2>
            </div>

            <div className="meta-img relative w-fit inline-block">
              <Image src={'/images/delivery-boy.png'} height={300} width={380} alt='image' className='relative z-2 px-14' />
              <Image src={'/images/delivery-shap.png'} height={100} width={100} alt='image' className='absolute top-10 right-0 z-20 px-14' />
            </div>
          </div>

          <div className="w-[58%] bg-white p-9 px-14 rounded-[50px] rounded-tl-none flex flex-col gap-6">
            <div className='flex justify-between items-center'>
              <Image src={'/images/quote.png'} width={80} height={80} alt='quote' />
              <Image src={'/images/shape_22.png'} width={80} height={80} alt='quote' />
            </div>

            <div
  key={show}
  className="text-purple-950 font-bold text-3xl leading-16 transition-all duration-900 ease-in-out opacity-0 animate-fade-in "
>
  {data[show].para}
</div>
            <div className="flex justify-between items-center gap-12">
              <div className="flex justify-center slick-dots relative w-1/2">
                {[...Array(data.length)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setShow(index)}
                    className={`${show === index ? "text-orange-400 scale-130" : "scale-100 text-[#d0c1a2]"} text-xl transition-all duration-300`}
                  >
                    <GoDotFill />
                  </button>
                ))}
              </div>
              <div className="w-1/2 flex flex-col items-end">
                <h4 className='font-bold text-2xl text-purple-950 transition-all duration-700 ease-in-out opacity-0 animate-fade-in '>{data[show].name}</h4>
                <span className='font-bold text-orange-400 text-base transition-all duration-700 ease-in-out opacity-0 animate-fade-in'>{data[show].designation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClientFeedback

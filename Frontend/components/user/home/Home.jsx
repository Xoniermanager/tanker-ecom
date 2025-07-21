import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const HomePage = () => {
  return (
    <div className="banner relative w-full py-28 overflow-hidden ">
      
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video className="w-full h-full  object-cover scale-x-[-1]" autoPlay loop muted>
          <source src="/videos/banner2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className='bg-black/50 absolute top-0 left-0 w-full h-full z-20'></div>

      
      <div className="relative z-22 max-w-7xl mx-auto h-full flex items-center justify-start">
        
       <div className="w-3/4 flex flex-col gap-7">
        <div className="border-white border-1 w-fit text-white uppercase font-semibold flex items-center gap-2 p-1 px-2">
            <Image src={'/images/left-wing.png'} width={15} height={15} alt='left wing'/> 
            <span className='text-lg'>We Offer Global Solutions</span>
             <Image src={'/images/right-wing.png'} width={15} height={15} alt='left wing'/> 
        </div>
        <h1 className='text-[110px] text-white font-black leading-28'>Welcome to Tanker Solutions</h1>
        <p className='text-white w-3/4 leading-relaxed text-lg'>Tanker Solutions is dedicated to providing the best quality cost effective solution to your fuel and dry bulk transport and delivery needs.</p>
         <div className='flex'>
        <Link href={'/contact'} className='btn-one text-xl tracking-wide'>
             Contact us
             </Link>
             </div>

       </div>
      </div>
    </div>
  );
};

export default HomePage;

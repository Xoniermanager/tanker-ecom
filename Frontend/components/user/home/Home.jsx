import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const HomePage = ({bannerData}) => {
  console.log("bannerData: ", bannerData)

 const para = bannerData?.contents?.find(item=> item.label === "Description").text
 const btnName = bannerData?.contents?.find(item=>(item.type === "link" && item.label === "Call To Action")).text
 const btnLink = bannerData?.contents?.find(item=>(item.type === "link" && item.label === "Call To Action")).link
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
            <span className='text-lg'>{bannerData?.subheading || "N/A"}</span>
             <Image src={'/images/right-wing.png'} width={15} height={15} alt='left wing'/> 
        </div>
        <h1 className='text-[110px] text-white font-black leading-28'>{bannerData?.heading || "N/A"}</h1>
        <p className='text-white w-3/4 leading-relaxed text-lg'>{para || "N/A"}</p>
         <div className='flex'>
        <Link href={btnLink} className='btn-one text-xl tracking-wide'>
             {btnName || "N/A"}
             </Link>
             </div>

       </div>
      </div>
    </div>
  );
};

export default HomePage;

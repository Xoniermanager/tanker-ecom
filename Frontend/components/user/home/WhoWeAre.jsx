import Image from 'next/image'
import React from 'react'

const WhoWeAre = ({whoWeAreData}) => {

   const para = whoWeAreData?.contents?.find(item=> (item.type === "text") && (item.label === "Description")).text
  const listGroups = whoWeAreData?.contents
  ?.find(item => item.type === "list" && item.label === "Highlights")
  ?.contents.sort((a,b)=>a.order - b.order) || [];


  return (
    <>
      <div className='w-full py-28 relative'>
        <div className="max-w-7xl mx-auto flex items-center gap-12">
            <div className="w-1/2 flex flex-col gap-3">
              <div className='flex items-center gap-2'> 
                <h4 className='text-lg font-semibold text-[22px] text-orange-400 uppercase'>{whoWeAreData?.subheading || "N/A"}</h4>
                <Image src={'/images/arrows.png'} width={43} height={11} alt='arrow'/></div>
                <h2 className='font-black text-7xl text-purple-950 capitalize'>{whoWeAreData?.heading || "N/A"}</h2>
                <p className='text-zinc-500  mt-8 text-lg font-medium'>{para || "N/A"}</p>

                <ul className="flex flex-col gap-8 mt-8">
  {listGroups.map((group, i) => {
    const heading = group?.contents?.find(item => item.label === "Heading")?.text || "N/A";
    const description = group?.contents?.find(item => item.label === "Description")?.text || "N/A";

    return (
      <li key={i} className="flex items-start gap-7">
        <span className="border-1 border-stone-200 rounded-full h-20 min-w-20 w-20 flex items-center justify-center bg-[#ecfbfe]">
          <Image src={`/images/icon_${i + 1}.png`} height={50} width={50} alt={`icon-${i + 1}`} />
        </span>
        <div className="flex flex-col gap-3">
          <h4 className="text-xl font-semibold">{heading}</h4>
          <p className="text-zinc-500 w-[65%] leading-7 font-medium">{description}</p>
        </div>
      </li>
    );
  })}
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

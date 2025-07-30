import Image from "next/image";
import React from "react";

const OurPeople = ({peopleData}) => {
  const cards = peopleData?.contents?.find(item=>item.type === "cards").contents
  return (
    <>
      <div
        style={{ backgroundImage: "url('/images/counter-bg.jpg')" }}
        className="py-28 w-full bg-no-repeat bg-cover"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/images/arrows.png"
                width={43}
                height={11}
                alt="arrow"
              />
              <span className="text-orange-400 font-semibold text-[22px] uppercase">
                {peopleData?.subheading || "N/A"}
              </span>
              <Image
                src="/images/arrows.png"
                width={43}
                height={11}
                alt="arrow"
              />
            </div>
            <h2 className="font-black text-7xl text-purple-950 w-1/2 text-center">
              {peopleData?.heading || "N/A"}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-10">
            {cards?.map((item, index)=>(
               <div key={index} className="flex flex-col justify-between items-center relative group">
              <div style={{backgroundImage: "url('/images/services-bg.jpg')"}} className="p-8 pb-26 bg-cover bg-center border-1 people-card relative border-[#e7e7e7] rounded-[40px] rounded-tl-[0px] group-hover:rounded-tl-[40px] group-hover:rounded-tr-[0px] w-full z-20 flex items-center flex-col justify-center gap-5">
                <h3 className="text-2xl font-black text-purple-950">{item?.title || "N/A"}</h3>
                <p className="text-center text-[#6e797b] font-medium leading-8">{item?.description || "N/A"}</p>
               
              </div>
              <Image className="object-center rounded-full w-[175px] h-[175px] border-8 border-white -mt-20 relative z-20" src={item?.thumbnail?.source} width={175} height={175} alt="truck"/>
               <span className="bg-black text-white p-0.5 px-2 rounded-md font-medium text-sm uppercase tracking-wide mt-2">{item?.subtitle || "N/A"}</span>
              <div className="text-white bg-orange-400 rounded-full h-14 w-14 absolute z-20 -bottom-20 flex items-center justify-center font-bold text-xl">0{index + 1}</div>
            </div>
            ))}
            
            {/* <div className="flex flex-col  justify-between items-center relative group">
              <div style={{backgroundImage: "url('/images/services-bg.jpg')"}} className="p-8 pb-26 border-1 bg-cover bg-center people-card relative border-[#e7e7e7] rounded-[40px] rounded-tl-[0px] group-hover:rounded-tl-[40px] group-hover:rounded-tr-[0px] w-full z-20 flex items-center flex-col justify-center gap-5">
                <h3 className="text-2xl font-black text-purple-950">Berlin hook</h3>
                <p className="text-center text-[#6e797b] font-medium leading-8">We are a team of experienced engineers, technicians, and technicians who are committed to delivering high-quality products and services to our customers.</p>
                
              </div>
              <Image className="object-center rounded-full w-[175px] h-[175px] border-8 border-white -mt-20 relative z-20" src={'/images/employee_two.jpg'} width={175} height={175} alt="truck"/>
              <span className="bg-black text-white p-0.5 px-2 rounded-md font-medium text-sm uppercase tracking-wide mt-2">Assembly fitter</span>
              <div className="text-white bg-orange-400 rounded-full h-14 w-14 absolute z-20 -bottom-20 flex items-center justify-center font-bold text-xl">02</div>
            </div>
            <div className="flex flex-col justify-between items-center relative group">
              <div style={{backgroundImage: "url('/images/services-bg.jpg')"}} className="p-8 pb-26 border-1 bg-cover bg-center people-card relative border-[#e7e7e7] rounded-[40px] rounded-tl-[0px] group-hover:rounded-tl-[40px] group-hover:rounded-tr-[0px] w-full z-20 flex items-center flex-col justify-center gap-5">
                <h3 className="text-2xl font-black text-purple-950">David walker</h3>
                <p className="text-center text-[#6e797b] font-medium leading-8">We are a team of experienced engineers, technicians, and technicians who are committed to delivering high-quality products and services to our customers.</p>
                
              </div>
              <Image className="object-center rounded-full w-[175px] h-[175px] border-8 border-white -mt-20 relative z-20" src={'/images/employee_three.jpg'} width={175} height={175} alt="truck"/>
              <span className="bg-black text-white p-0.5 px-2 rounded-md font-medium text-sm uppercase tracking-wide mt-2">Logistic specialist</span>
              <div className="text-white bg-orange-400 rounded-full h-14 w-14 absolute z-20 -bottom-20 flex items-center justify-center font-bold text-xl">03</div>
            </div> */}

          </div>
          <div  className=" mt-16 flex justify-center">

          <div className="line w-[70%] relative border-b-1 border-[#e3d6c5]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurPeople;

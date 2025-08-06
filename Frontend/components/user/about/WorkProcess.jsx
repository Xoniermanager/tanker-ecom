import Image from "next/image";
import React from "react";

const WorkProcess = ({workProcessData}) => {

  const processData = workProcessData?.contents?.find(item=> (item.type === "cards") && (item.label === "Process")).contents
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
              <span className="text-orange-400 font-bold uppercase">
                {workProcessData?.subheading || "N/A"}
              </span>
              <Image
                src="/images/arrows.png"
                width={43}
                height={11}
                alt="arrow"
              />
            </div>
            <h2 className="font-black text-7xl text-purple-950 w-1/2 text-center capitalize">
              {workProcessData?.heading || "N/A"}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-10">
          { processData?.map((item, i)=>(
<div className="flex flex-col justify-between items-center relative group" key={i}>
              <div style={{backgroundImage: "url('/images/services-bg.jpg')"}} className="p-8 pb-26 bg-cover border-1 process-card relative border-[#e7e7e7] rounded-[40px] rounded-tl-[0px] group-hover:rounded-tl-[40px] group-hover:rounded-tr-[0px] w-full z-20 flex items-center flex-col justify-center gap-5">
                <h3 className="text-2xl font-black text-purple-950 capitalize">{item?.title || "N/A"}</h3>
                <p className="text-center text-[#6e797b] font-medium ">{item?.description || "N/A"}</p>
                <span className="bg-black text-white p-0.5 px-1 rounded-md font-bold text-sm uppercase tracking-wide absolute left-5 -bottom-2">{item?.subtitle || "N/A"}</span>
              </div>
              <Image className="object-center object-cover rounded-full w-[175px] h-[175px] border-8 border-white -mt-20 relative z-20" src={item?.thumbnail?.source} width={175} height={175} alt="truck"/>
              <div className="text-white bg-orange-400 rounded-full h-14 w-14 absolute z-20 -bottom-20 flex items-center justify-center font-bold text-xl">0{i + 1}</div>
            </div>
          ))}
            
          </div>
          <div  className=" mt-16 flex justify-center">

          <div className="line w-[70%] relative border-b-1 border-[#e3d6c5]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkProcess;

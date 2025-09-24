
"use client";
import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50/70">
      <div className="flex flex-col items-center space-y-4">
       <Image src={'/images/tire.png'} height={200} width={200} alt='tire' className='animate-spin w-22 h-22 object-contain' priority={true}
          loading="eager"
          placeholder="empty"
          unoptimized={false}
          quality={75}/>
        <h1 className="text-xl font-semibold text-orange-500">Loading...</h1>
      </div>
    </div>
  );
};

export default Loading;


"use client";
import React from "react";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { AiFillStepBackward } from "react-icons/ai";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2edf6] px-6 text-center">
      <h1 className="text-[120px] font-extrabold text-orange-500 leading-none">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-purple-900 mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you're looking for might have been removed or is temporarily unavailable.
      </p>
      
      <div className="flex items-center gap-5">
         <button className="flex items-center gap-2.5 px-7 py-3 text-purple-950 hover:text-white bg-purple-200 group hover:bg-purple-950 rounded-lg transition duration-300 font-medium tracking-wide" onClick={()=>router.back()}> <AiFillStepBackward className="text-lg"/> Step Back</button>
      <Link
        href="/"
        className="flex items-center gap-2.5 px-7 py-3 text-white bg-purple-900 group hover:bg-purple-950 rounded-lg transition duration-300 font-medium tracking-wide"
      >
       <FaLongArrowAltLeft  className="text-xl group-hover:-left-2"/> Back to Home
      </Link>
     
      </div>
    </div>
  );
};

export default NotFound;

"use client";
import React, { useRef, useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import { FaCircleArrowRight } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

import { IoArrowForward } from "react-icons/io5";

const OurProducts = () => {
    const [totalPages, setTotalPages] = useState(3);
    const [activePage, setActivePage] = useState(1)
  const prevRef = useRef(null);
  const nextRef = useRef(null);
 
  const slides = [
    {
      id:1,
      img: "/images/truckOne.jpg",
      heading: "CIVACON",
      para: "Tank truck products including API bottom loading adaptors...",
    },
    {
      id:2,
      img: "/images/truckOne.jpg",
      heading: "Knappco and SureSeal",
      para: "Specialist equipment for transporting dry bulk products.",
    },
    {
      id:3,
      img: "/images/truckOne.jpg",
      heading: "CLA-VAL",
      para: "Aviation fueling products including underwing couplers.",
    },
    {
      id:4,
      img: "/images/truckOne.jpg",
      heading: "CIVACON",
      para: "Tank truck products including API bottom loading adaptors...",
    },
    {
      id:5,
      img: "/images/truckOne.jpg",
      heading: "CIVACON",
      para: "Tank truck products including API bottom loading adaptors...",
    },
    {
      id:6,
      img: "/images/truckOne.jpg",
      heading: "Knappco and SureSeal",
      para: "Specialist equipment for transporting dry bulk products.",
    },
    
  ];



  return (
    <div className="w-full py-28 px-4 flex flex-col gap-10">
     
      <div className="flex flex-col gap-4 items-center mb-20">
        <div className="flex items-center gap-2">
          <Image src="/images/arrows.png" width={43} height={11} alt="arrow" />
          <span className="text-orange-400 font-semibold text-[22px]">WHAT WE OFFER</span>
          <Image src="/images/arrows.png" width={43} height={11} alt="arrow" />
        </div>
        <h2 className="font-black text-7xl text-purple-950">Our Products</h2>
        <p className="text-zinc-500 w-1/2 text-center text-lg font-medium">
          Tanker Solutions is the New Zealand distributor for some of the very best global petroleum equipment suppliers for tankers and tank trailers.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-5 border-1 border-gray-200 rounded-lg max-w-7xl mx-auto w-full p-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-semibold text-gray-700">Brand</label>
          <select name="brand" id="brand" className="border-gray-200 border-1 px-1 py-3 rounded-xl font-medium bg-gray-50">
          <option value="">All Brands</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-semibold text-gray-700">Categories</label>
          <select name="brand" id="brand" className="border-gray-200 border-1 px-1 py-3 rounded-xl font-medium bg-gray-50">
          <option value="">All Categories</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-semibold text-gray-700">Sub-Categories</label>
          <select name="brand" id="brand" className="border-gray-200 border-1 px-1 py-3 rounded-xl font-medium bg-gray-50">
          <option value="">All Sub-Categories</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-semibold text-gray-700">Made In</label>
          <select name="brand" id="brand" className="border-gray-200 border-1 px-1 py-3 rounded-xl font-medium bg-gray-50">
          <option value="">All Origins</option>
          </select>
        </div>
      </div>

     
        <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
        {slides.map((item, index) => (
          <div className="main-box" key={index}>
            <div
              style={{ backgroundImage: `url(${item.img})` }}
              className="bg-purple-200 product-truck-img relative bg-cover bg-center rounded-3xl flex items-center justify-center text-2xl font-bold h-74 overflow-hidden"
            ></div>
            <div className="bg-white content-box p-3 w-4/5 -mt-52 mx-auto z-20 relative">
              <div className="border-2 border-orange-400 border-dashed p-6 flex items-center flex-col justify-between gap-5">
                <Image
                  src="/images/truck-icon.png"
                  width={75}
                  height={75}
                  alt="truck icon"
                />
                <h3 className="text-2xl font-bold text-purple-950 text-center truncate w-full">
                  {item.heading}
                </h3>
                <p className="text-zinc-500 font-medium text-base text-center leading-8 line-clamp-3">
                  {item.para}
                </p>

                <Link
                  href={`/products/${item.id}`}
                  className="relative inline-flex items-center justify-start w-46 h-12 px-8 overflow-hidden capitalize text-lg font-bold text-purple-950 group rounded-md ml-4"
                >
                  <span className="z-10 transition-all duration-300 transform group-hover:-translate-x-4" >
                    view product
                  </span>
                  <span className="absolute -left-0 z-0 transition-all duration-300 transform group-hover:translate-x-[140px] text-orange-400">
                    <FaCircleArrowRight />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
        <div className="flex items-center gap-4 justify-center">

        {[...Array(totalPages)].map((item, index)=>(
            <button className={` ${activePage === (index + 1) ? "bg-orange-400 text-white" : "bg-[#f6e7d3]"} hover:bg-orange-400 hover:text-white  h-12 w-12 rounded-full border-white text-purple-950 font-bold border-1 border-dashed text-lg`}>{index + 1}</button>
        ))}
        <button className="h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl" > <IoArrowForward /> </button>
        </div>
      

      
    </div>
  );
};

export default OurProducts;


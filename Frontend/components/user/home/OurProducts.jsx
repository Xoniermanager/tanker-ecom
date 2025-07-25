"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaCircleArrowRight } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

const OurProducts = ({productData}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);


  const para = productData?.contents?.find(item=>item.type === 'text').text

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
  ];

  useEffect(() => {
    if (
      swiperInstance &&
      swiperInstance.params.navigation &&
      prevRef.current &&
      nextRef.current
    ) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;

      swiperInstance.navigation.destroy(); 
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="w-full py-28 px-4">
     
      <div className="flex flex-col gap-4 items-center mb-20">
        <div className="flex items-center gap-2">
          <Image src="/images/arrows.png" width={43} height={11} alt="arrow" />
          <span className="text-orange-400  font-semibold text-[22px] uppercase">{productData?.subheading || "N/A"}</span>
          <Image src="/images/arrows.png" width={43} height={11} alt="arrow" />
        </div>
        <h2 className="font-black text-7xl text-purple-950 capitalize">{productData?.heading || "N/A"}</h2>
        <p className="text-zinc-500 w-1/2 text-center text-lg font-medium">
          {para || "N/A"}
        </p>
      </div>

     
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        onSwiper={setSwiperInstance}
        className=""
      >
        {slides.map((item, index) => (
          <SwiperSlide className="main-box" key={index}>
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
                  className="relative inline-flex items-center justify-start w-48 h-12 px-8 overflow-hidden text-lg font-bold text-purple-950 group rounded-md ml-4"
                >
                  <span className="z-10 transition-all duration-300 transform group-hover:-translate-x-4">
                    View Products
                  </span>
                  <span className="absolute -left-0 z-0 transition-all duration-300 transform group-hover:translate-x-[150px] text-orange-400">
                    <FaCircleArrowRight />
                  </span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="border-b-1 border-sky-200 w-full mt-18"></div>
      <div className="flex justify-center gap-4 bg-white -mt-2 w-fit mx-auto px-6">
        <button
          ref={prevRef}
          className="border-1 border-stone-200 h-16 w-16 flex items-center justify-center rounded-full hover:bg-orange-400"
        >
          <Image
            src={"/images/left-arrow.png"}
            height={30}
            width={30}
            alt="left"
          />
        </button>
        <button
          ref={nextRef}
          className="border-1 border-stone-200 h-16 w-16 flex items-center justify-center rounded-full hover:bg-orange-400"
        >
          <Image
          className="scale-x-[-1] "
            src={"/images/left-arrow.png"}
            height={30}
            width={30}
            alt="right"
          />
        </button>
      </div>
    </div>
  );
};

export default OurProducts;

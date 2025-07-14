"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductDetailComponents = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const data = [
    { img: "/images/product1.jpg" },
    { img: "/images/product02.jpg" },
    { img: "/images/product1.jpg" },
    { img: "/images/product02.jpg" },
  ];

  return (
    <div className="py-28 w-full bg-[#fbf2f2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-10">
          <div className="w-[45%] relative">
            <div className="bg-white p-6 rounded-4xl flex flex-col items-center gap-4 w-full">
              <div className="absolute top-2/3 left-6 z-10 transform -translate-y-1/2">
                <button
                  ref={prevRef}
                  className="bg-[#e3ebed] shadow-lg rounded-full p-5 hover:bg-orange-400 hover:text-white transition"
                >
                  <FaChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute top-2/3 right-6 z-10 transform -translate-y-1/2">
                <button
                  ref={nextRef}
                  className="bg-[#e3ebed] shadow-lg rounded-full p-5 hover:bg-orange-400 hover:text-white transition"
                >
                  <FaChevronRight size={20} />
                </button>
              </div>

              <Swiper
                modules={[Navigation, Thumbs]}
                spaceBetween={10}
                loop={true}
                thumbs={{ swiper: thumbsSwiper }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;

                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                className="w-full rounded-2xl"
              >
                {data.map((item, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={item.img}
                      height={500}
                      width={500}
                      alt={`product-${index}`}
                      className="w-full object-contain rounded-2xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
                className="w-full mt-4"
              >
                {data.map((item, index) => (
                  <SwiperSlide key={`thumb-${index}`}>
                    <Image
                      src={item.img}
                      height={100}
                      width={100}
                      alt={`thumb-${index}`}
                      className="cursor-pointer rounded-xl border-2 border-[#e7e7e4] hover:border-orange-400 transition-all duration-300 p-2 h-32 w-32 flex items-center justify-center object-cover mb-4"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="w-[55%] flex flex-col gap-5">
            <h2 className="text-4xl font-bold text-purple-950 ">ALord</h2>
            <div className="flex items-center gap-5">
              <span className="font-semibold text-purple-950 text-3xl">
                $100.00
              </span>{" "}
              <span>$12.00</span> <span className="text-red-500">-20%</span>{" "}
              <span className="text-white bg-purple-950 p-0.5 px-2 rounded-lg text-sm capitalize font-semibold">
                in stock
              </span>
            </div>
            <div></div>
            <p className="text-gray-700 ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              placerat, urna sed laoreet iaculis.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl transition-all">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponents;

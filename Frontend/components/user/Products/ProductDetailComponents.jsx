"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { FaFacebook, FaSquareInstagram } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FaChevronLeft, FaChevronRight, FaStar, FaRegStar  } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const ProductDetailComponents = ({
  productData,
  quantity,
  setQuantity,
  handleIncrease,
  handleDecrease,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [active, setActive] = useState(1)
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this product!",
          text: "I found this amazing product. Have a look:",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing not supported on this browser. Please copy the link.");
    }
  };
  const discount = Math.floor(
    ((Number(productData?.regularPrice) - Number(productData?.sellingPrice)) /
      Number(productData?.regularPrice)) *
      100
  );

  return (
    <>
    <div className="py-28 w-full bg-[#fbf2f2] flex flex-col gap-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-14">
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
                {productData?.images?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={item.source}
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
                {productData?.images?.map((item, index) => (
                  <SwiperSlide className="mb-3" key={`thumb-${index}`}>
                    <Image
                      src={item.source}
                      height={100}
                      width={100}
                      alt={`thumb-${index}`}
                      className="cursor-pointer rounded-xl border-2 border-[#e7e7e4] hover:border-orange-400 transition-all duration-300 p-2 h-32 w-32  flex items-center justify-center object-cover "
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="w-[55%] flex flex-col gap-5">
            <h2 className="text-4xl font-bold text-purple-950 capitalize">
              {productData?.name}
            </h2>
            <div className="flex items-center gap-5">
              <span className="font-semibold text-purple-950 text-3xl">
                ${productData?.sellingPrice}
              </span>{" "}
              <span className="text-[#00000080] line-through">
                ${productData?.regularPrice}
              </span>{" "}
              <span className="text-red-500">{discount}%</span>{" "}
              <span className="text-white bg-purple-950 p-0.5 px-2 rounded-lg text-sm capitalize font-semibold">
                {productData?.inventory?.status.split("_").join(" ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        {[...Array(5)].map((_, index) =>
          index < 3 ? (
            <FaStar key={index} className="text-yellow-400" />
          ) : (
            <FaRegStar key={index} className="text-yellow-400" />
          )
        )}
      </span>
      <span className="font-medium">( 3 Customer Reviews )</span>
    </div>
            <p className="text-gray-700 ">{productData.shortDescription}</p>
            <ul className="flex flex-col gap-2">
              {productData.highlights.map((item, index) => (
                <li className="flex items-center gap-1.5" key={index}>
                  <FaCheck className="text-purple-950" /> {item}
                </li>
              ))}
            </ul>
            <div className="flex items-end gap-4">
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold text-purple-950">Quantity:</h4>
                <div className="flex items-center border border-slate-300 rounded-lg w-28 bg-white">
                  <button
                    onClick={handleDecrease}
                    className="px-2 py-1 text-lg font-bold text-gray-600 hover:text-purple-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-12 py-3 text-center outline-none"
                    min="1"
                  />
                  <button
                    onClick={handleIncrease}
                    className="px-2 py-1 text-lg font-bold text-gray-600 hover:text-purple-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 font-medium rounded-lg transition-all">
                Add to Cart
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-1.5">
                <FaCheck className="text-purple-950" />{" "}
                <b className="text-black">Estimated Delivery: </b>{" "}
                <p className="text-purple-950"> 60-60 days</p>{" "}
              </li>
              <li className="flex items-center gap-1.5">
                <FaCheck className="text-purple-950" />{" "}
                <b className="text-black">Free Shipping: </b>{" "}
                <p className="text-purple-950"> Via Super Economy Global</p>{" "}
              </li>
            </ul>
            <div className="flex gap-2.5">
              {" "}
              <b className="text-black">Share: </b>{" "}
              <button className="hover:text-orange-500" onClick={handleShare}>
                <FaFacebook />
              </button>{" "}
              <button className="hover:text-orange-500" onClick={handleShare}>
                <FaSquareInstagram />
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-1 border-zinc-300 bg-white rounded-3xl w-full">
        <ul className="flex items-center justify-center w-full">
          <li className=""> <button className={`${active === 1 ? "bg-orange-500 text-white" : "bg-slate-200"} text-lg font-medium px-5 py-2 border-b-lg`} onClick={()=>setActive(1)}>Description</button></li>
          <li className=""> <button className={`${active === 2 ? "bg-orange-500 text-white" : "bg-slate-200"} text-lg font-medium px-5 py-2 border-b-lg`} onClick={()=>setActive(2)}>Specifications</button></li>
        </ul>
        <div className="">

        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetailComponents;

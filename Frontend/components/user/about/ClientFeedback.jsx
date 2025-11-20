"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { GoDotFill } from "react-icons/go";

const ClientFeedback = ({ testimonialData, testimonials }) => {
  const [show, setShow] = useState(0);
  const intervalRef = useRef(null);

  const startAutoScroll = () => {
    if (!testimonials || testimonials.length === 0) return;
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setShow((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [testimonials?.length]);

  return (
    <>
      <div
        style={{ backgroundImage: 'url("/images/feedback-bg.jpg")' }}
        className="py-22 md:py-28 px-6 w-full"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-[42%] flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h4 className="text-orange-400 font-black md:text-xl lg:text-[22px] uppercase">
                  {testimonialData?.subheading || "N/A"}{" "}
                </h4>
                <Image
                  src={"/images/arrows.png"}
                  height={11}
                  width={43}
                  alt="arrow"
                />
              </div>
              <h2 className="font-black text-4xl md:text-5xl lg:text-6xl text-purple-950 text-center md:text-start">
                {" "}
                {testimonialData?.heading || "N/A"}
              </h2>
            </div>

            <div className="meta-img relative w-fit inline-block">
              <Image
                src={"/images/delivery-boy.png"}
                height={300}
                width={380}
                alt="image"
                className="relative z-2 px-14"
              />
              <Image
                src={"/images/delivery-shap.png"}
                height={100}
                width={100}
                alt="image"
                className="absolute top-10 right-0 z-20 px-14"
              />
            </div>
          </div>

          <div
            className="md:w-[58%] bg-white p-5 md:p-9 px-8 md:px-14 rounded-[50px] rounded-tl-none flex flex-col gap-6"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          >
            <div className="flex justify-between items-center">
              <Image
                src={"/images/quote.png"}
                width={80}
                height={80}
                alt="quote"
                className="w-14 md:w-22"
              />
              <Image
                src={"/images/shape_22.png"}
                width={80}
                height={80}
                alt="quote"
                className="w-14 md:w-22"
              />
            </div>

            <div
              // key={show}
              className="text-purple-950 font-bold text-xl md:text-3xl leading-10 md:leading-16 transition-all duration-900 ease-in-out opacity-0 animate-fade-in "
            >
              {testimonials?.[show]?.message}
            </div>

            <div className="flex justify-between items-center gap-12">
              <div className="flex justify-center slick-dots relative w-full md:w-1/2">
                {testimonials?.slice(0, 3)?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setShow(index)}
                    className={`${
                      show === index
                        ? "text-orange-400 scale-130"
                        : "scale-100 text-[#d0c1a2]"
                    } text-xl transition-all duration-300`}
                  >
                    <GoDotFill />
                  </button>
                ))}
              </div>

              <div className="w-1/2 flex flex-col items-end">
                <h4 className="font-bold text-xl md:text-2xl text-purple-950 transition-all duration-700 ease-in-out opacity-0 animate-fade-in ">
                  {testimonials?.[show]?.name}
                </h4>
                <span className="font-bold text-end md:text-start text-orange-400 text-sm md:text-base transition-all duration-700 ease-in-out opacity-0 animate-fade-in">
              {testimonials?.[show]?.designation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientFeedback;

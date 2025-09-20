import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomePage = ({ bannerData }) => {
  console.log("bannerData: ", bannerData);

  const para = bannerData?.contents?.find(
    (item) => item.label === "Description"
  ).text;
  const btnName = bannerData?.contents?.find(
    (item) => item.type === "link" && item.label === "Call To Action"
  ).text;
  const btnLink = bannerData?.contents?.find(
    (item) => item.type === "link" && item.label === "Call To Action"
  ).link;
  return (
    <div className="banner relative w-full py-28 overflow-hidden ">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {bannerData.thumbnail.type === "video" ? (
          <video
            className="w-full h-full  object-cover scale-x-[-1]"
            autoPlay
            loop
            muted
          >
            <source src={bannerData?.thumbnail?.fullPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={bannerData?.thumbnail?.fullPath}
            className="w-full h-full object-center object-cover"
            width={800}
            height={800}
            alt="banner image"
            quality={100}
          />
        )}
      </div>
      <div className="bg-black/50 absolute top-0 left-0 w-full h-full z-20"></div>

      <div className="relative z-22 max-w-7xl mx-auto h-full flex items-center justify-start px-6">
        <div className="w-full  md:w-3/4 flex flex-col items-center md:items-start gap-5 lg:gap-7">
          <div className="border-white border-1 w-fit  text-white uppercase font-semibold flex items-center justify-center md:justify-start gap-2 p-1 px-2">
            <Image
              src={"/images/left-wing.png"}
              width={15}
              height={15}
              alt="left wing"
            />
            <span className="text-sm md:text-[16px] lg:text-lg">{bannerData?.subheading || "N/A"}</span>
            <Image
              src={"/images/right-wing.png"}
              width={15}
              height={15}
              alt="left wing"
            />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[110px] text-white font-black leading-16 md:leading-20 text-center md:text-start lg:leading-28">
            {bannerData?.heading || "N/A"}
          </h1>
          <p className="text-white  lg:w-3/4 leading-relaxed text-lg text-center md:text-start first-letter:uppercase">
            {para || "N/A"}
          </p>
          <div className="flex mt-2">
            <Link href={btnLink} className="btn-one text-xl tracking-wide">
              {btnName || "N/A"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

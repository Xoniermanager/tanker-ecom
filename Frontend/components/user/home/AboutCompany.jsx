import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiPhoneCall } from "react-icons/fi";

import { FaCheckCircle } from "react-icons/fa";

const AboutCompany = ({ aboutData }) => {
  const firstPara = aboutData?.contents?.find(
    (item) => item.type === "text" && item.order === 1
  ).text;
  const secondPara = aboutData?.contents?.find(
    (item) => item.type === "text" && item.order === 4
  ).text;

  const listData = aboutData?.contents
    ?.find((item) => item.type === "list")
    .contents.sort((a, b) => a.order - b.order);

  const phoneBtn = aboutData?.contents
    ?.find((item) => item.type === "group")
    .contents.find((item) => item.type === "phone" && item?.order === 1);
  const redirectBtn = aboutData?.contents
    ?.find((item) => item.type === "group")
    .contents.find((item) => item.type === "link" && item.order === 2);

 
  return (
    <div className="bg-[#f2edf6] py-28 relative">
      <div className="max-w-7xl mx-auto flex items-center  gap-16 relative z-1">
        <div className="w-[45%] relative">
          <video className="rounded-2xl w-[95%]" autoPlay muted loop>
            <source src="/videos/about-video.mp4" />
          </video>
          <div className="h-20 w-20 absolute -top-9 -right-4 rounded-full bg-orange-400 text-white text-4xl font-bold flex items-center justify-center">
            {" "}
            18{" "}
          </div>
        </div>
        <div className="w-[55%] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h4 className="text-orange-400  font-semibold text-[22px] uppercase">
              {aboutData?.subheading || "N/A"}{" "}
            </h4>{" "}
            <Image
              src={"/images/arrows.png"}
              height={11}
              width={43}
              alt="arrrow"
            />
          </div>
          <h2 className="font-black text-7xl text-purple-950">
            {" "}
            {aboutData?.heading || "N/A"}
          </h2>
          <p className="text-zinc-500 text-lg font-medium first-letter:uppercase">
            {" "}
            {firstPara || "N/A"}
          </p>

          <ul className="mt-5 flex flex-col gap-5">
            {listData?.map((item, i) => (
              <li className=" text-purple-950 font-semibold text-lg flex gap-2">
                {" "}
                <span className="text-purple-950 text-xl mt-1.5">
                  <FaCheckCircle />{" "}
                </span>{" "}
                {item?.text}
              </li>
            ))}
          </ul>

          {/* <div className="flex items-center gap-6 mt-8">
            <Link
              href={`tel:${phoneBtn?.phone_number}`}
              className="flex items-center gap-4 group"
            >
              <span className="h-16 w-16 bg-purple-950 rounded-full text-white flex items-center justify-center text-3xl ">
                {" "}
                <FiPhoneCall />{" "}
              </span>
              <div className="flex flex-col gap-0.5">
                <h4 className="uppercase font-bold text-orange-400">
                  {phoneBtn?.text || "N/A"}
                </h4>
                <p className="text-purple-950 group-hover:text-orange-400 font-bold text-xl">
                  {phoneBtn?.phone_number || "N/A"}
                </p>
              </div>
            </Link>
            <div></div>
            <Link
              style={{ fontWeight: 600 }}
              href={redirectBtn?.link}
              className="btn-one"
            >
              {redirectBtn?.text || "N/A"}
            </Link>
          </div> */}
          <p className="text-zinc-500 font-medium text-lg leading-8 group-hover:text-white pt-8">
            {secondPara || "N/A"}
          </p>
        </div>
      </div>
      <Image
        src={"/images/boxes.png"}
        height={150}
        width={150}
        alt="boxes"
        className="boxes-anim absolute top-1/3 right-6 "
      />
      <Image
        src={"/images/plane.png"}
        height={190}
        width={230}
        alt="boxes"
        className=" absolute top-2/3 right-16 "
      />
    </div>
  );
};

export default AboutCompany;

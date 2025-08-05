import Image from "next/image";
import Link from "next/link";
import React from "react";

import { FaArrowRightLong } from "react-icons/fa6";
import { FaUser, FaComment } from "react-icons/fa";

const OurArticle = ({ blogData }) => {
  return (
    <>
      <div className="bg-[#f2edf6] py-28 w-full px-4">
        <div className="flex flex-col gap-4 items-center mb-20">
          <div className="flex items-center gap-2">
            <Image
              src="/images/arrows.png"
              width={43}
              height={11}
              alt="arrow"
            />
            <span className="text-orange-400 font-semibold text-[22px] uppercase">
              Our Articles
            </span>
            <Image
              src="/images/arrows.png"
              width={43}
              height={11}
              alt="arrow"
            />
          </div>
          <h2 className="font-black text-7xl text-purple-950 w-[60%] text-center">
            Our Latest Articles Post From Blog
          </h2>
        </div>
        <div className="grid grid-cols-3 items-start gap-7 max-w-7xl mx-auto">
          {blogData?.map((item, index) => {
            const createdDate = new Date(item.createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );
            return (
              <div className="bg-white group" key={index}>
                <div className="w-full h-60 overflow-hidden">
                  <Image
                    src={item?.thumbnail?.fullPath || "N/A"}
                    width={300}
                    height={300}
                    alt="img"
                    className="w-full h-60 object-cover group-hover:scale-110"
                    quality={100}
                  />
                </div>
                <div className="post-info">
                  <ul className="tags flex">
                    <li>{createdDate || "N/A"}</li>
                    <li className="ml-auto small">
                      <Link
                        href={`/news/${item.slug}`}
                        className="text-white flex items-center gap-3 font-semibold -mt-0.5"
                      >
                        {" "}
                        Read More <FaArrowRightLong />
                      </Link>{" "}
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-center gap-2.5 p-7 px-9 border-r-4 border-orange-400">
                  <div className="flex items-center justify-between w-full">
                    <h5 className="flex items-center gap-1 text-orange-400 font-semibold text-sm">
                      <span className="text-orange-400 text-sm">
                        <FaUser />
                      </span>{" "}
                      By {item?.author?.name || "N/A"}
                    </h5>
                  </div>
                  <h3 className="text-xl text-start w-full font-semibold text-purple-950 line-clamp-2 group-hover:underline">
                    {" "}
                    {item.title || "N/A"}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OurArticle;

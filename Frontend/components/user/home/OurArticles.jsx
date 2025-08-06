import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { FaArrowRightLong } from "react-icons/fa6";
import { FaUser, FaComment } from "react-icons/fa";
import api from "../common/api";

const OurArticles = ({ articleData }) => {
  const [blogData, setBlogData] = useState(null);

  console.log("article blog data: ", blogData)
  

  const getBlogsData = async () => {
    try {
      const response = await api.get(`/blogs/published`);
      if (response.status === 200) {
        setBlogData(response.data.data.data);
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlogsData();
  }, []);

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
              {articleData?.subheading || "N/A"}
            </span>
            <Image
              src="/images/arrows.png"
              width={43}
              height={11}
              alt="arrow"
            />
          </div>
          <h2 className="font-black text-7xl text-purple-950 w-[60%] text-center">
            {articleData?.heading || "N/A"}
          </h2>
        </div>
        <div className="flex items-start gap-7">
          {blogData?.slice(0,4).map((item, index) => {
            const date = new Date(item.createdAt).toLocaleDateString("en-GB",{
              day: "2-digit",
              month:"short",
              year: "numeric"
            })
           return <div className="bg-white group w-full" key={index}>
              <div className="w-full h-60 overflow-hidden">
                <Image
                  src={item.thumbnail.fullUrl}
                  width={200}
                  height={200}
                  alt="img"
                  className="w-full h-60 object-cover group-hover:scale-110"
                  quality={100}
                />
              </div>
              <div className="post-info">
                <ul className="tags flex">
                  <li>{date}</li>
                  <li className="ml-auto small">
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-white flex items-center gap-3 font-semibold -mt-0.5 hover:text-orange-400"
                    >
                      {" "}
                      Read More <FaArrowRightLong />
                    </Link>{" "}
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center gap-3 p-7 px-9 border-r-4 border-orange-400">
                <div className="flex items-center justify-between w-full">
                  <h5 className="flex items-center gap-1 text-orange-400 font-semibold text-sm">
                    <span className="text-orange-400 text-sm">
                      <FaUser />
                    </span>{" "}
                    By {item.author.name}
                  </h5>
                  {/* <h5 className="flex items-center gap-1 text-orange-400 font-semibold text-sm">
                    <span className="text-orange-400 text-sm">
                      <FaComment />{" "}
                    </span>{" "}
                    0{item.comments} comments
                  </h5> */}
                </div>
                <h3 className="text-xl font-semibold w-full text-start text-purple-950 line-clamp-2 min-h-14 group-hover:underline">
                  {" "}
                  {item.title}
                </h3>
              </div>
            </div>
})}
        </div>
      </div>
    </>
  );
};

export default OurArticles;

"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../../../components/user/common/api';
import Image from 'next/image';
import { FaUser } from "react-icons/fa";
import { Skeleton, Box } from '@mui/material';
import { useParams } from 'next/navigation';
import parse from 'html-react-parser';
import { IoIosSearch } from "react-icons/io";
import Link from 'next/link';

const htmlString = `
  <h1>Revolutionizing Fuel Transportation with Smart Tanker Solutions</h1>

  



  <p>
    In today’s fast-paced logistics world, the transportation of liquid goods, especially fuel and water, demands precision, safety, and efficiency.
    <em>Smart Tanker Solutions</em> are transforming how industries handle these critical deliveries.
  </p>

  <h2>Why Tanker Solutions Matter</h2>

  <p>
    Traditional tanker systems are often prone to issues like leakage, theft, inaccurate measurements, and inefficient routing. Modern tanker solutions
    address these challenges by incorporating technology-driven features, ensuring maximum reliability.
  </p>

  <h2>Key Features of Modern Tanker Systems</h2>

  <ul>
    <li><strong>GPS Tracking:</strong> Real-time monitoring of tanker location for optimized routing and delivery times.</li>
    <li><strong>IoT Sensors:</strong> Smart sensors monitor fluid levels, pressure, and temperature inside the tank.</li>
    <li><strong>Digital Metering:</strong> Accurate fuel dispensing and automatic report generation.</li>
    <li><strong>Remote Valve Control:</strong> Enhance safety by remotely managing tanker operations.</li>
  </ul>

  <h2>Industries Benefiting from Tanker Solutions</h2>

  <p>These smart systems are being widely adopted in:</p>
  <ol>
    <li>Petroleum and Fuel Distribution</li>
    <li>Water Supply for Municipal and Industrial Use</li>
    <li>Chemical and Liquid Waste Transport</li>
  </ol>

  <h2>Case Study: Improving Fuel Delivery</h2>

  <p>
    A logistics company reported a 30% improvement in fuel delivery time and a 20% reduction in theft after switching to smart tanker solutions. With better
    route planning and digital flow meters, they also minimized human errors and increased customer trust.
  </p>

  <blockquote>
    "Since integrating smart tanker systems, we’ve reduced fuel loss and improved delivery tracking drastically." – Logistics Manager, XYZ Corp.
  </blockquote>

  <h2>Conclusion</h2>

  <p>
    The future of tanker logistics lies in embracing automation, data, and control. Investing in <strong>Smart Tanker Solutions</strong> ensures
    better compliance, safety, and profitability.
  </p>

  <p>For a tailored solution for your fleet, <a href="/contact">contact our team</a> today.</p>
`;


const page = () => {
  const [blogData, setBlogData] = useState(null);
  const [allBlogs, setALLBlogs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { slug } = useParams();

  const getBlogData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/blogs/${slug}`);
      if (response.status === 200) {
        setBlogData(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllBlogData = async () => {
    try {
      const response = await api.get(`/blogs/published`);
      if (response.status === 200) {
        setALLBlogs(response?.data?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBlogData();
    getAllBlogData();
  }, []);

  return (
    <div className="flex max-w-7xl items-start gap-12 mx-auto my-24">
      
      <div className="w-[64%] bg-[#f2edf6] rounded-t-2xl flex flex-col gap-4">
        {isLoading || !blogData ? (
          <Skeleton variant="rectangular" height={300} className="w-full rounded-2xl" />
        ) : (
          <Image
            src={blogData?.thumbnail?.source}
            width={500}
            height={500}
            alt="blog image"
            quality={100}
            className="w-full h-98 object-cover rounded-2xl object-center"
          />
        )}
        <div className="p-8 flex flex-col gap-4">
          
          {isLoading || !blogData ? (
            <Skeleton variant="text" width={160} height={30} />
          ) : (
            <ul className="post-author">
              <li className="bg-white p-1 pr-4 rounded-r-full flex items-center gap-1 text-sm w-fit text-orange-500 font-semibold">
                <FaUser /> By {blogData?.author?.name}
              </li>
            </ul>
          )}
           {isLoading || !blogData ? (
            <>
              <Skeleton height={30} />
              <Skeleton height={30} width="80%" />
              <Skeleton height={200} />
            </>
          ) : (
            <div className="prose max-w-none blog-content">{parse(htmlString)}</div>
          )}
          
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg text-purple-950">Categories:</span>
              {isLoading || !blogData ? (
                <Skeleton width={100} />
              ) : (
                blogData?.categories?.map((item, index) => (
                  <span key={index} className="bg-white border-slate-400 border-1 text-slate-500 hover:text-white hover:bg-purple-950 hover:border-purple-950 cursor-pointer font-medium px-3 py-0.5 rounded capitalize">
                    {item}
                  </span>
                ))
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg text-purple-950">Tags:</span>
              {isLoading || !blogData ? (
                <Skeleton width={100} />
              ) : (
                blogData?.tags?.map((item, index) => (
                  <span key={index} className="bg-black border-1 text-white font-medium hover:bg-orange-500 cursor-pointer px-3 py-0.5 rounded capitalize">
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>

          
         
        </div>
      </div>

      
      <div className="w-[36%] flex flex-col gap-6">
        
        <div className="bg-[#f2edf6] p-6 px-8 rounded">
          <div className="rounded-full flex items-center bg-white overflow-hidden border-1 border-[#c8c8ca]">
            <input type="text" className="outline-none w-full px-5" placeholder="Search..." />
            <button className="bg-orange-400 -ml-[2px] rounded-full h-14 w-14 min-w-14 flex items-center justify-center text-white text-2xl">
              <IoIosSearch />
            </button>
          </div>
        </div>

        
        <div className="bg-[#f2edf6] p-6 px-8 rounded flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Image src="/images/shape_star.png" height={35} width={35} alt="star" />
            Products
          </h3>
          <ul className='flex flex-col gap-3'>
            <li className="flex items-center gap-2 font-semibold bg-orange-500 px-4 py-2 rounded text-white cursor-pointer">
              <Image src="/images/white-star.png" height={30} width={30} alt="star" />
              Product One
            </li>
            <li className="flex items-center gap-2 font-semibold bg-white px-5 py-3 rounded text-purple-950 cursor-pointer">
              
              Product One
            </li>
          </ul>
        </div>

        
        <div className="bg-[#f2edf6] p-6 px-8 rounded flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Image src="/images/shape_star.png" height={35} width={35} alt="star" />
            Recent News
          </h3>
          <div className="flex flex-col gap-0">
            {allBlogs ? (
              allBlogs.slice(0,3).map((item) => {
                const date = new Date(item.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <Link
                    href={`/news/${item.slug}`}
                    key={item._id}
                    className="flex items-start gap-5 border-b-1 group border-stone-300 py-6 last:border-none"
                  >
                    <div className="min-w-16 w-16 h-16 overflow-hidden rounded-full">
                      <Image
                        src={item.thumbnail.source}
                        height={82}
                        width={82}
                        alt="blog thumbnail"
                        quality={100}
                        className="rounded-full object-cover w-16 h-16 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-950 text-xl capitalize line-clamp-3 group-hover:text-orange-500">
                        {item?.title || "N/A"}
                      </h3>
                      <span className="text-stone-500 font-semibold text-[12px]">{date}</span>
                    </div>
                  </Link>
                );
              })
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <Box key={i} sx={{ pt: 0.5 }} className="flex items-start gap-4 py-4 border-b-1 border-stone-300">
                  <Skeleton variant="circular" width={64} height={64} />
                  <Box className="flex-1">
                    <Skeleton width="90%" />
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../../../components/user/common/api';
import Image from 'next/image';
import { FaUser } from "react-icons/fa";
import { Skeleton, Box } from '@mui/material';
import { useParams } from 'next/navigation';
import parse from 'html-react-parser';
import { IoIosSearch } from "react-icons/io";
import Link from 'next/link';

const page = () => {
  const [blogData, setBlogData] = useState(null);
  const [allBlogs, setALLBlogs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchBlogData, setSearchBlogData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

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

  
  const getSearchedBlog = useCallback(async (title) => {
    if (!title.trim()) {
      setSearchBlogData([]);
      return;
    }

    setIsSearchLoading(true);
    try {
      const response = await api.get(`/blogs/published?title=${encodeURIComponent(title)}`);
      if (response.status === 200) {
       
        const searchResults = response.data.data.data.slice(0, 3);
        setSearchBlogData(searchResults);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      setSearchBlogData([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getSearchedBlog(searchTitle);
    }, 500); 
    return () => clearTimeout(timeoutId);
  }, [searchTitle, getSearchedBlog]);

  useEffect(() => {
    getBlogData();
    getAllBlogData();
  }, []);

  return (
    <div className="flex max-w-7xl items-start gap-12 mx-auto my-24">
      
      <div className="w-[64%] bg-[#f2edf6] rounded-t-2xl flex flex-col gap-4">
        {(isLoading || !blogData) ? (
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
            <div className="prose max-w-none blog-contents ">
              <h1>{blogData.title}</h1>
              <p>{blogData.subtitle}</p>
              <span>{parse(blogData.content)}</span>
              </div>
          )}
          
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg text-purple-950">Categories:</span>
              {isLoading || !blogData ? (
                <Skeleton width={100} />
              ) : (
                blogData?.categories?.map((item, index) => (
                  <span key={index} className="bg-white border-slate-400 border-1 text-slate-500 hover:text-white hover:bg-purple-950 hover:border-purple-950 cursor-pointer font-medium px-3 py-0.5 rounded capitalize">
                    {item.name}
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
            <input 
              type="text" 
              value={searchTitle} 
              onChange={(e) => setSearchTitle(e.target.value)} 
              className="outline-none w-full px-5" 
              placeholder="Search blogs by title..." 
            />
            <button className="bg-orange-400 hover:bg-orange-500 -ml-[2px] rounded-full h-14 w-14 min-w-14 flex items-center justify-center text-white text-2xl">
              <IoIosSearch />
            </button>
          </div>
          
          
          {searchTitle.trim() && (
            <div className="mt-4">
              <h4 className="font-semibold text-purple-950 mb-3">Search Results:</h4>
              {isSearchLoading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white rounded">
                      <Skeleton variant="circular" width={40} height={40} />
                      <div className="flex-1">
                        <Skeleton width="90%" height={20} />
                        <Skeleton width="60%" height={16} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchBlogData.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {searchBlogData.map((item) => {
                    const date = new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <Link
                        href={`/news/${item.slug}`}
                        key={item._id}
                        className="flex items-start gap-3 p-3 bg-white rounded hover:shadow-md transition-shadow group"
                      >
                        <div className="min-w-10 w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            src={item.thumbnail.source}
                            height={60}
                            width={60}
                            alt="blog thumbnail"
                            quality={100}
                            className="rounded-full object-cover w-12 h-12 group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-purple-950  line-clamp-2 group-hover:text-orange-500 transition-colors">
                            {item?.title || "N/A"}
                          </h5>
                          <span className="text-stone-500 text-xs">{date}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-stone-500 text-sm p-3 bg-white rounded text-center">
                  No blogs found for "{searchTitle}"
                </div>
              )}
            </div>
          )}
        </div>

        
        {/* <div className="bg-[#f2edf6] p-6 px-8 rounded flex flex-col gap-3">
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
        </div> */}

        
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
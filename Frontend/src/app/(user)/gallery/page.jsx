 "use client";
import React, { useState, useEffect } from "react";
import PageBanner from "../../../../components/user/common/PageBanner";
import GalleryComponent from "../../../../components/user/gallery/GalleryComponent";
import Counter from "../../../../components/user/home/Counter";
import { getPageData } from "../../../../components/admin/cms/common/getPageData";
import api from "../../../../components/user/common/api";
import Cookies from "js-cookie";
import PageLoader from "../../../../components/common/PageLoader";
import FailedDataLoading from "../../../../components/common/FailedDataLoading";

const page = () => {
  const [galleryData, setGalleryData] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const pageData = await getPageData();
      setGalleryData(pageData?.data || null);
    } catch (error) {
      console.error("error: ", error);
    }
    finally{
      setIsLoading(false)
    }
  };

  const getBlogData = async () => {
    setIsLoading(true)
    try {
      const accessToken = Cookies.get("accessToken");

      const response = await api.get(
        `/gallery/frontend?page=${currentPage}&limit=${pageLimit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setBlogData(response.data.data.data);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(response?.data?.data.page);
        
      }
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
    
  }, []);

  useEffect(() => {
    getBlogData();
  }, [currentPage, pageLimit])


  if(isLoading){
    return (
      <PageLoader/>
    )
  }

  if(!galleryData){
    return (
      <FailedDataLoading />
    )
  }
  

  const counterData =
    galleryData?.sections?.find(
      (item) => item?.section_id === "section-track-record"
    ) || null;
  return (
    <>
      <PageBanner heading={"our gallery"} />
      <GalleryComponent blogData={blogData} currentPage={currentPage} setPageLimit={setPageLimit} totalPages={totalPages} setTotalPages={setTotalPages} setCurrentPage={setCurrentPage}/>
      {counterData && <Counter counterData={counterData} />}
    </>
  );
};

export default page;

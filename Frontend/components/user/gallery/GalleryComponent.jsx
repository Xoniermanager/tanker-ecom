"use client";
import React, { useState, useEffect } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { IoArrowForward, IoArrowBack, IoClose } from "react-icons/io5";

const GalleryComponent = ({
  blogData,
  currentPage,
  totalPages,
  setTotalPages,
  setCurrentPage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

 console.log("current page: ", currentPage)
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);


  useEffect(() => {
    const handleKeyNavigation = (event) => {
      if (!isModalOpen) return;
      
      if (event.key === "ArrowLeft") {
        handlePrevImage();
      } else if (event.key === "ArrowRight") {
        handleNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyNavigation);
    return () => document.removeEventListener("keydown", handleKeyNavigation);
  }, [isModalOpen, currentImageIndex]);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === blogData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? blogData.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div className="py-22 md:py-28 max-w-7xl px-6 mx-auto flex flex-col gap-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {blogData?.map((item, index) => (
            <div
              style={{ backgroundImage: `url(${item.image.fullUrl})` }}
              className="p-6 w-full h-72 md:h-[450px] hover:-translate-y-3 flex items-end bg-cover bg-center bg-no-repeat group cursor-pointer transition-transform duration-300"
              key={index}
              onClick={() => openModal(index)}
            >
              <div className="flex flex-col items-center gap-3 w-full group-hover:bg-orange-300/40 bg-blur p-3 pb-0 md:pb-3 py-6">
                <span className="text-white capitalize bg-orange-400 px-2 font-semibold">
                  {item.tags}
                </span>
                <h2 className="text-white font-bold text-xl md:text-2xl capitalize text-center md:w-[88%]">
                  {item.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-4 justify-center w-full">
          {[...Array(totalPages)].map((item, index) => (
            <button
              className={` ${
                Number(currentPage) === index + 1
                  ? "bg-orange-400 text-white"
                  : "bg-[#f6e7d3]"
              } hover:bg-orange-400 hover:text-white h-12 w-12 rounded-full border-white text-purple-950 font-bold border-1 border-dashed text-lg`}
              key={index}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={totalPages < 2}
            className="h-12 w-12 rounded-full border-white bg-[#42666f] disabled:bg-[#42666f68] hover:bg-[#334f56] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl"
            onClick={() => setCurrentPage(Number(currentPage) + 1)}
          >
            <IoArrowForward />
          </button>
        </div>
        {/* <div className="flex items-center gap-4 justify-center">
                      <button
                        className="h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] disabled:bg-[#588c99] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl rotate-180"
                        onClick={() => setCurrentPage(Number(currentPage) - 1)}
                        disabled={currentPage === 1}
                      >
                        <IoArrowForward />
                      </button>
        
                      {(() => {
                        let startPage, endPage;
        
                        if (totalPages <= 3) {
                          startPage = 1;
                          endPage = totalPages;
                        } else if (currentPage === 1) {
                          startPage = 1;
                          endPage = 3;
                        } else if (currentPage === totalPages) {
                          startPage = totalPages - 2;
                          endPage = totalPages;
                        } else {
                          startPage = currentPage - 1;
                          endPage = currentPage + 1;
                        }
        
                        return [...Array(endPage - startPage + 1)].map((_, index) => {
                          const pageNumber = startPage + index;
                          return (
                            <button
                              className={`${
                                currentPage === pageNumber
                                  ? "bg-orange-400 text-white"
                                  : "bg-[#f6e7d3]"
                              } hover:bg-orange-400 hover:text-white h-12 w-12 rounded-full border-white text-purple-950 font-bold border-1 border-dashed text-lg`}
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          );
                        });
                      })()}
        
                      
                      <button
                        className="h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] disabled:bg-[#588c99] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl"
                        onClick={() => setCurrentPage(Number(currentPage) + 1)}
                        disabled={totalPages === currentPage}
                      >
                        <IoArrowForward />
                      </button>
                    </div> */}
      </div>

     
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-90 z-550 flex items-center justify-center">
          
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60 bg-red-400 hover:bg-red-500 bg-opacity-50 rounded-full p-2 transition-colors group"
          >
            <IoClose size={30} className="group-hover:rotate-90" />
          </button>

         
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 bg-purple-900 hover:bg-orange-400 bg-opacity-50 rounded-full p-3 transition-colors duration-200"
          >
            <IoArrowBack size={24} />
          </button>

         
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 bg-purple-900 hover:bg-orange-400 bg-opacity-50 rounded-full p-3 transition-colors duration-200"
          >
            <IoArrowForward size={24} />
          </button>

          <div className="max-w-5xl max-h-[90vh] mx-4 rounded-lg overflow-hidden">
            <img
              src={blogData[currentImageIndex]?.image.fullUrl}
              alt={blogData[currentImageIndex]?.alt || "Gallery image"}
              className="w-full h-[80vh] object-contain object-center"
            />
            
           
            <div className="text-center mt-4 text-white">
              
              <h3 className="text-xl font-bold mb-2 text-purple-900">
                {blogData[currentImageIndex]?.title}
              </h3>
              <p className="text-sm text-white">
                {currentImageIndex + 1} of {blogData.length}
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {blogData?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? "bg-orange-400" : "bg-gray-500"
                }`}
              />
            ))}
          </div>

          <div 
            className="absolute inset-0 -z-10"
            onClick={closeModal}
          />
        </div>
      )}
    </>
  );
};

export default GalleryComponent;
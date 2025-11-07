"use client";

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoImage } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import DeletePopup from "../../common/DeletePopup";
import api from "../../../user/common/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import { FaTimes, FaTrash } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";

export default function GalleryAdmin({
  galleryData,
  setPageLimit,
  handleToggleStatus,
  setGalleryData,
  handleEditGallery,
  updateFormData,
  handleChange,
  setUpdateFormData,
  errMessage,
  setErrMessage,
  isLoading,
  setIsLoading,
  handleRemoveTag,
   setIsOpen,
   isOpen,
   imagePreview,
   setImagePreview ,
  totalPages, currentPage, setCurrentPage, handlePagesLimit
}) {
  const [DeletePopupShow, setDeletePopupShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [tagInput, setTagInput] = useState("");
 

  const handleDelete = async (id) => {
    setIsLoading(true);

    try {
      const accessToken = Cookies.get("accessToken");
      const payload = { ids: [deleteId] };
      const response = await api.delete(`/gallery`, {
        data: payload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        toast.success(`Gallery deleted successfully`);
        setDeletePopupShow(false);
        let filtered = galleryData.filter((item) => item._id !== deleteId);
        setGalleryData(filtered);
        setDeleteId(null);
      }
    } catch {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const showHandleDelete = (id) => {
    setDeletePopupShow(true);
    setDeleteId(id);
  };

  const handleEdit = (item) => {
    setUpdateFormData(item);
    setIsOpen(true);
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !updateFormData.tags.includes(trimmedTag)) {
      const updatedTags = [...updateFormData.tags, trimmedTag];
      setUpdateFormData({ ...updateFormData, tags: updatedTags });
      setTagInput("");
    }
  };

  const handleRemoveTagLocal = (tagToRemove) => {
    setUpdateFormData({
      ...updateFormData,
      tags: updateFormData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateFormData({ ...updateFormData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {DeletePopupShow && (
        <DeletePopup
          message={"You want to delete this gallery"}
          onCancel={() => setDeletePopupShow(false)}
          onDelete={() => handleDelete(deleteId)}
          errMessage={errMessage}
          isLoading={isLoading}
        />
      )}

      <div className="w-full bg-white px-6 py-3 rounded-lg flex items-center justify-between my-4">
        <h2 className="text-2xl font-bold ">Gallery Images</h2>
        <div className="flex items-center gap-2">
          <span className="font-medium">Page Limit: </span>
          <select
            name="pageLimit"
            id="pageLimit"
            className="w-35 outline-none border-1 border-stone-200 rounded-lg p-2"
            onChange={handlePagesLimit}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryData?.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl group"
          >
            {" "}
            <div className="overflow-hidden h-52">
              <Image
                src={item?.image?.fullUrl}
                alt={item.title}
                height={240}
                width={240}
                className="w-full h-52 object-cover group-hover:scale-110 "
                quality={100}
              />
            </div>
            <div className="p-4 flex flex-col gap-1.5">
              <h3 className="text-xl font-semibold mb-1 capitalize">
                {item.title}
              </h3>
              <div className="flex gap-1.5 items-center">
                {item.tags.map((item, i) => (
                  <span className="bg-orange-100 px-3 py-1 text-[11px] rounded-full text-orange-500 font-medium capitalize" key={i}>
                    {" "}
                    {item}{" "}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2 bg-purple-50 px-4 py-2 rounded-lg">
                <span className={`  text-sm font-medium`}>
                  Status:{" "}
                  <span
                    className={`${
                      item.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    } capitalize `}
                  >
                    {item.status === "active" ? "active" : "inactive"}
                  </span>
                </span>
                <button
                  onClick={() => handleToggleStatus(item.id, item.status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    item.status === "active" ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      item.status === "active"
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <MdEdit className="text-lg" /> Edit
                </button>
                <button
                  onClick={() => showHandleDelete(item._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <MdDeleteOutline className="text-lg" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
      </div>
   
<div className="flex items-center gap-4 justify-center w-full col-span-3">
  {/* Previous Button */}
  <button
    disabled={currentPage === 1}
    className="h-12 w-12 rounded-full border-white bg-[#42666f] disabled:bg-[#42666f68] hover:bg-[#334f56] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl rotate-180"
    onClick={() => setCurrentPage(Number(currentPage) - 1)}
  >
    <IoArrowForward />
  </button>

  {/* Page Numbers */}
  {(() => {
    let startPage, endPage;
    
    if (totalPages <= 3) {
      // If total pages are 3 or less, show all
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage === 1) {
      // If on first page, show 1, 2, 3
      startPage = 1;
      endPage = 3;
    } else if (currentPage === totalPages) {
      // If on last page, show last 3 pages
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      // Show current page in the middle
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    return [...Array(endPage - startPage + 1)].map((_, index) => {
      const pageNum = startPage + index;
      return (
        <button
          className={`${
            Number(currentPage) === pageNum
              ? "bg-orange-400 text-white"
              : "bg-[#f6e7d3]"
          } hover:bg-orange-400 hover:text-white h-12 w-12 rounded-full border-white text-purple-950 font-bold border-1 border-dashed text-lg`}
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
        >
          {pageNum}
        </button>
      );
    });
  })()}

  {/* Next Button */}
  <button
    disabled={currentPage >= totalPages}
    className="h-12 w-12 rounded-full border-white bg-[#42666f] disabled:bg-[#42666f68] hover:bg-[#334f56] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl"
    onClick={() => setCurrentPage(Number(currentPage) + 1)}
  >
    <IoArrowForward />
  </button>
</div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className=" w-full" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed z-149 w-full inset-0 bg-black/10 backdrop-blur-sm bg-opacity-25" />
          </Transition.Child>

          <div className="fixed z-151 inset-0 overflow-y-auto">
            <div className="flex min-h-full flex-col gap-4 items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-1/2 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-purple-950 mb-4"
                  >
                    Edit Image Details
                  </Dialog.Title>
                  <form className="flex w-full" onSubmit={handleEditGallery}>
                    <div className="grid grid-cols-2 gap-5 w-full">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          name="title"
                          className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                          placeholder="Image Title"
                          value={updateFormData.title}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="alt">Alternative Text</label>
                        <input
                          type="text"
                          name="alt"
                          className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                          placeholder="Alternative Text"
                          value={updateFormData.alt}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="tags">Tags</label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            name="tags"
                            className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none flex-1"
                            placeholder="Type tag and press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => handleTagKeyDown(e)}
                          />
                          <button
                            type="button"
                            onClick={() => addTag()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300 font-medium group flex items-center gap-1"
                            disabled={!tagInput.trim()}
                          >
                            <IoMdAdd className="group-hover:rotate-90 text-xl" />{" "}
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {updateFormData.tags.map((tag, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                            >
                              <span>{tag}</span>
                              <FaTimes
                                className="cursor-pointer"
                                onClick={() => handleRemoveTagLocal(tag)}
                              />
                            </div>
                          ))}{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 col-span-2">
                        <label>Upload Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="border border-gray-300 rounded-md px-3 py-2"
                        />
                        {imagePreview && (
                          <div className="mt-3">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              width={200}
                              height={200}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                  <div className="mt-6 flex justify-end gap-2.5">
                    <button
                    type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2 rounded-md font-medium bg-red-400 hover:bg-red-500 text-white"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      onClick={handleEditGallery}
                    disabled={isLoading}
                      className="px-5 py-2 rounded-md font-medium bg-purple-900 disabled:bg-purple-400 text-white hover:bg-purple-950"
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

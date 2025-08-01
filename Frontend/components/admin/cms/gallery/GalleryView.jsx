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

export default function GalleryAdmin({ galleryData, setPageLimit, handleToggleStatus, setGalleryData }) {
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [DeletePopupShow, setDeletePopupShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  console.log("gallery data: ", galleryData)

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
        let filtered = galleryData.filter(item=>item._id !== deleteId)
        setGalleryData(filtered)
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
    setEditItem(item);
    setIsOpen(true);
  };

  

  return (
    <>
      {DeletePopupShow && (
        <DeletePopup
          message={"You want to delete this gallery"}
          onCancel={() => setDeletePopupShow(false)}
          onDelete={handleDelete}
          errMessage={errMessage}
          isLoading={isLoading}
        />
      )}
     
        <div className="w-full bg-white px-6 py-3 rounded-lg flex items-center justify-between my-4">
        <h2 className="text-2xl font-bold ">Gallery Images</h2>
        <div className="flex items-center gap-2">
          <span className="font-medium">Page Limit: </span>
        <select name="pageLimit" id="pageLimit" className="w-35 outline-none border-1 border-stone-200 rounded-lg p-2" onChange={(e)=>setPageLimit(e.target.value)}>
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
            > <div className="overflow-hidden h-52">
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
                    <span className="bg-orange-100 px-3 py-1 text-[11px] rounded-full text-orange-500 font-medium capitalize">
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
                      {item.status ? "active" : "inactive"}
                    </span>
                  </span>
                  <button
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      item.status ? "bg-green-600" : "bg-gray-400"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        item.status ? "translate-x-6" : "translate-x-1"
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

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className=" w-full"
            onClose={() => setIsOpen(false)}
          >
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
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Edit Image Details
                    </Dialog.Title>
                    <div className="mt-4 space-y-4">
                      <input
                        type="text"
                        className="w-full border px-3 py-2 rounded-md"
                        value={editItem?.title || ""}
                        onChange={(e) =>
                          setEditItem((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="w-full border px-3 py-2 rounded-md"
                        value={editItem?.description || ""}
                        onChange={(e) =>
                          setEditItem((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={""}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save
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

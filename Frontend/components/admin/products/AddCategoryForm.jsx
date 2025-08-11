import Link from "next/link";
import React from "react";

import { CiCircleList } from "react-icons/ci";
import { FaStarOfLife } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";

const AddCategoryForm = ({ formData, handleSubmit, handleChange, isLoading, errMessage }) => {
  return (
    <div className="w-full p-12 bg-white rounded-xl shadow-[0_0_15px_#00000015] flex flex-col gap-10">
      <div className="flex items-center justify-between ">
        <h2 className="text-2xl font-semibold  text-gray-800">
          Add New Category
        </h2>
        <Link
          href={"/dashboard/products"}
          className="bg-purple-500 text-white rounded-lg font-semibold py-2.5 px-8  hover:bg-purple-600 transition flex items-center gap-2"
        >
          {" "}
          <CiCircleList className="text-xl" /> Product List{" "}
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className=" mb-1 text-sm font-medium text-gray-900 flex gap-1 "
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="slug"
              className=" mb-1 text-sm font-medium text-gray-900 flex gap-1 "
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Category Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Ex: hard_ware"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className=" flex flex-col gap-2 col-span-2">
                      <label htmlFor="description" className="flex gap-1 mb-1 text-sm font-medium text-gray-900">
                        <span className='text-red-500 text-[8px]'><FaStarOfLife /></span> Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder='Enter product description here...'
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      ></textarea>
                    </div>
        </div>
        <div className='flex justify-end'>
                   <p className='text-red-500'>{errMessage}</p>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <button
                    disabled={isLoading || formData.name === "" || formData.slug === ""}
                    type="submit"
                    className="bg-orange-400 disabled:bg-orange-300 disabled:cursor-none text-white font-semibold py-2.5 px-8 rounded hover:bg-orange-500 transition flex items-center gap-2"
                  >
                   {isLoading ? "Uploading..." : "Upload"} <AiOutlineCloudUpload className='text-xl'/>
                  </button>
                </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;

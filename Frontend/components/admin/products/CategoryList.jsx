import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import DeletePopup from "../common/DeletePopup";
import api from "../../user/common/api";
import { MdOutlineCloudUpload } from "react-icons/md";

const CategoryList = ({
  categoryData,
  showDeletePopup,
  setShowDeletePopup,
  isLoading,
  errMessage,
  handleDeleteCategory,
  handleDelete,
  deleteCat,
  showEditPopup,
  setShowEditPopup,
  updateFormData,
  handleUpdatedChange,
  handleUpdateSubmit,
  handleEdit,
  handleToggleStatus,
}) => {
  return (
    <>
      {showDeletePopup && (
        <DeletePopup
          onCancel={() => setShowDeletePopup(false)}
          onDelete={() => handleDelete(deleteCat?.id)}
          message={`Are your sure to delete ${deleteCat.name} category?`}
          isLoading={isLoading}
          errMessage={errMessage}
        />
      )}

      {showEditPopup && (
        <>
          <div
            className="w-full backdrop-blur-md fixed top-0 left-0 right-0 bottom-0 z-150 h-full"
            onClick={() => setShowEditPopup(false)}
          ></div>
          <div className="bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8  z-200 shadow-[0_0_18px_#00000020] w-1/2 rounded-lg flex flex-col gap-5 ">
            <h2 className="text-2xl font-semibold text-purple-900">
              Edit Testimonial
            </h2>
            <form
              onSubmit={handleUpdateSubmit}
              className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8 overflow-x-scroll"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Name </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={updateFormData.name}
                    onChange={handleUpdatedChange}
                    className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="slug">slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="Slug"
                    value={updateFormData.slug}
                    onChange={handleUpdatedChange}
                    className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter your description"
                    value={updateFormData.description}
                    onChange={handleUpdatedChange}
                    className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                {errMessage && (
                  <p className="text-sm text-red-600 font-medium">
                    {errMessage}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    updateFormData.name === "" ||
                    updateFormData.slug === ""
                  }
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
                >
                  {isLoading ? "Updating..." : "Update"}{" "}
                  <MdOutlineCloudUpload />
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <div className="w-full p-12 bg-white rounded-xl shadow-[0_0_15px_#00000015] flex flex-col gap-10">
        <h2 className="text-2xl font-semibold  text-gray-800 capitalize">
          Category list
        </h2>
        <table className="min-w-full table-auto text-sm text-left border-separate border-spacing-y-4">
          <thead className=" bg-stone-100 uppercase text-xs rounded-xl overflow-hidden">
            <tr className="">
              <th className="px-6 py-4 font-medium text-nowrap">
                Category Name
              </th>
              <th className="px-6 py-4 font-medium text-nowrap">
                Category Slug
              </th>
              <th className="px-6 py-4 font-medium">Category Description</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium"> Actions </th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {categoryData?.length > 0 ? (
              categoryData?.map((item, index) => (
                <tr
                  key={index}
                  className="bg-violet-50 rounded-xl overflow-hidden shadow"
                >
                  <td className="px-6 py-6 text-red-500 font-semibold capitalize w-fit text-nowrap">
                    {item?.name || "N/A"}
                  </td>
                  <td className="px-6 py-6  font-semibold capitalize w-fit text-nowrap">
                    <span className="bg-green-50 px-5 py-2 rounded-lg text-green-500">
                      {item?.slug || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-6 first-letter:capitalize">
                    <span className="line-clamp-2">
                      {item?.description || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-between mt-2 bg-purple-50 px-4 py-2 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item?._id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          item?.status ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            item?.status
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-xl text-gray-500 flex items-center gap-2">
                    <button className="flex items-center justify-center h-8 w-8 rounded-lg text-white bg-orange-400 hover:bg-orange-500">
                      <FaEye />
                    </button>
                    <button
                      className="flex items-center justify-center h-8 w-8 rounded-lg text-white bg-green-400 hover:bg-green-500"
                      onClick={() => handleEdit(item._id, item.name)}
                    >
                      <MdOutlineEdit />
                    </button>
                    <button
                      className="flex items-center justify-center h-8 w-8 rounded-lg text-white bg-red-400 hover:bg-red-500"
                      onClick={() => handleDeleteCategory(item._id, item.name)}
                    >
                      {" "}
                      <MdDeleteOutline />{" "}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-violet-50 rounded-xl overflow-hidden shadow">
                <td className="px-6 py-6 text-center" colSpan={5}>
                  {" "}
                  Data not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CategoryList;

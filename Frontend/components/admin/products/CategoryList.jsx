import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { IoArrowForward } from "react-icons/io5";
import DeletePopup from "../common/DeletePopup";
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
  // Pagination props
  currentPage,
  setCurrentPage,
  totalPages,
  pageLimit,
  handleListLimit,
  searchName,
  handleSearch,
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
              Edit Category
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

      <div className="w-full p-8 bg-white rounded-xl shadow-[0_0_15px_#00000015] flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800 capitalize">
          Category list
        </h2>

        {/* Filter Controls */}
        <div className="bg-purple-50 rounded-xl shadow-md p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700">
              Show entries:
            </span>
            <select
              className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleListLimit(e.target.value)}
              value={pageLimit}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => handleSearch(e.target.value)}
                className="border border-gray-300 text-sm pl-4 pr-10 py-2 rounded-md w-64 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing page <span className="font-semibold text-purple-600">{currentPage}</span> of{" "}
            <span className="font-semibold text-purple-600">{totalPages}</span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left border-separate border-spacing-y-4">
            <thead className="bg-stone-100 uppercase text-xs rounded-xl overflow-hidden">
              <tr className="">
                <th className="px-6 py-4 font-medium text-nowrap">
                  Category Name
                </th>
                <th className="px-6 py-4 font-medium text-nowrap">
                  Category Slug
                </th>
                <th className="px-6 py-4 font-medium">Category Description</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
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
                    <td className="px-6 py-6 font-semibold capitalize w-fit text-nowrap">
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
                              item?.status ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-xl text-gray-500 flex items-center gap-2">
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
                        <MdDeleteOutline />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-violet-50 rounded-xl overflow-hidden shadow">
                  <td className="px-6 py-6 text-center" colSpan={5}>
                    {searchName
                      ? `No categories found matching "${searchName}"`
                      : "No categories available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-4 justify-center mt-6">
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
                        : "bg-orange-100 text-orange-400"
                    } hover:bg-orange-400 hover:text-white border-1 h-12 w-12 border-dashed border-white rounded-full font-bold text-lg transition-colors duration-200`}
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
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryList;
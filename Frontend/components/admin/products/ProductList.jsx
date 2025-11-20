"use client";
import React, { useState, useEffect } from "react";
import PageBar from "../common/PageBar";
import { FaAngleDown } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Fragment } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiDollar } from "react-icons/bi";
import DeletePopup from "../common/DeletePopup";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import {
  MdOutlineInventory2,
  MdOutlineEdit,
  MdOutlineAutoFixHigh,
  MdDeleteOutline,
} from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";

const ProductList = ({
  categoryData,
  productData,
  totalPages,
  setCurrentPage,
  currentPage,
  deletePopupShow,
  setDeletePopupShow,
  setDeleteProduct,
  handleDelete,
  isLoading,
  errMessage,
  searchInput,
  setSearchInput,
  handlePageLimit,
  selectedCategories,
  setSelectedCategories,
  handleCategoryChange,
  handleToggleStatus,
  handleBulkDelete,
  selectedProducts,
  handleCheck,
  totalProducts
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <>
      {deletePopupShow && (
        <DeletePopup
          message={"Are you sure to delete product"}
          onCancel={() => setDeletePopupShow(false)}
          onDelete={handleDelete}
          isLoading={isLoading}
          errMessage={errMessage}
        />
      )}
      <div className="w-full flex flex-col gap-10">
        <PageBar heading={"Product list"} />
        <div className="flex items-start gap-6">
          <div className="w-[69%] flex flex-col gap-3">
            <div className="bg-white p-4 flex justify-between items-center rounded-lg">
              <div className="flex items-center gap-5 ">
                <h3 className="capitalize font-medium">Product Limit:</h3>
                <select
                  name="productCount"
                  id="productCount"
                  className="p-2 w-32 rounded-lg border-1 outline-none cursor-pointer border-slate-200"
                  onChange={(e) => handlePageLimit(e.target.value)}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="px-5 py-2.5 bg-orange-400 group relative cursor-pointer rounded-lg font-semibold text-white hover:bg-orange-500">
                Actions
                <ul className="p-4 w-[200px] absolute top-full -left-1/2 z-150 shadow-[0_0_10px_#00000010] hidden group-hover:block rounded-lg bg-white">
                  <li>
                    <button
                      className="flex justify-between w-full  hover:cursor-pointer items-center gap-2 hover:text-orange-500"
                      onClick={handleBulkDelete}
                    >
                      <span className="flex items-center gap-2">
                        <MdDeleteOutline /> Delete{" "}
                      </span>{" "}
                      {selectedProducts.length > 0 && (
                        <span className="h-4.5 w-4.5 flex items-center justify-center bg-red-500 text-white rounded-full text-[12px]">
                          {" "}
                          {selectedProducts.length}{" "}
                        </span>
                      )}{" "}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5   rounded-lg">
              <table className="min-w-full  text-left text-sm">
                <thead className="bg-[#f3f0ff]  uppercase text-xs ">
                  <tr>
                    <th className="p-4">
                      {/* <input type="checkbox" className="accent-orange-500" /> */}
                    </th>

                    <th className="py-4 px-2">Photo</th>
                    <th className="py-4 px-2">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                {!isLoading ? (
                  <tbody>
                    {productData?.length > 0 ? (
                      productData?.map((product, index) => (
                        <Fragment key={index}>
                          <tr
                            style={{ borderRadius: "18px", overflow: "hidden" }}
                            className="bg-white shadow-sm rounded-xl overflow-hidden mb-4"
                          >
                            <td className="py-5 px-4 ">
                              <input
                                type="checkbox"
                                className="accent-orange-500 cursor-pointer"
                                checked={selectedProducts.includes(product._id)}
                                onChange={() => handleCheck(product._id)}
                              />
                            </td>

                            <td className="py-5 px-2">
                              <Link
                                className="w-10 h-10 rounded-full overflow-hidden group"
                                href={`products/view/${product.slug}`}
                              >
                                <img
                                  src={
                                    product?.images[0]?.source
                                      ? product?.images[0]?.source
                                      : "/images/dummy.jpg"
                                  }
                                  alt={product.name}
                                  className="w-10 h-10 rounded-full group-hover:scale-105 object-contain"
                                />
                              </Link>
                            </td>
                            <td className=" max-w-[150px] truncate">
                              <Link
                                className="py-5 px-4 font-medium text-gray-800 hover:text-orange-500 capitalize "
                                href={`products/view/${product?.slug}`}
                              >
                                {" "}
                                {product.name}{" "}
                              </Link>
                            </td>
                            <td className="py-5 px-2">
                              <span
                                className={`px-2 capitalize py-1 ${
                                  product?.category?.name
                                    ? "text-purple-800 bg-purple-100"
                                    : "text-red-500 bg-red-100"
                                } text-[12px] font-medium  rounded-lg  text-nowrap`}
                              >
                                {" "}
                                {product?.category?.name
                                  ? `${product?.category?.name}`
                                  : "Not found"}{" "}
                              </span>
                            </td>
                            <td className="py-5 px-4">
                              {" "}
                              <span className="flex items-center gap-0.5 bg-orange-50 w-fit rounded-lg text-orange-500 px-2 py-1 font-medium">
                                {" "}
                                <BiDollar />{" "}
                                {Number(product?.sellingPrice).toFixed(2)}
                              </span>
                            </td>

                            <td className="py-5 px-4 font-medium">
                              <span
                                className={`${
                                  product?.inventory?.status === "in_stock"
                                    ? "text-green-500"
                                    : "text-red-500"
                                } capitalize text-nowrap`}
                              >
                                {product.inventory?.status?.replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center justify-between mt-2 bg-purple-50  rounded-lg">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleStatus(product?._id)
                                  }
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                    product?.status === "active"
                                      ? "bg-green-600"
                                      : "bg-gray-400"
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                      product?.status === "active"
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                              </div>
                            </td>
                            <td
                              className="py-5 px-4 relative"
                              onMouseLeave={() => setOpenMenuIndex(null)}
                            >
                              <button
                                className="text-xl text-gray-500 hover:text-gray-700"
                                onClick={() => toggleMenu(index)}
                              >
                                <BsThreeDots />
                              </button>

                              {openMenuIndex === index && (
                                <div className="absolute right-4 top-12 w-42 bg-white  shadow-[0_0_15px_#00000030] rounded-lg py-2 z-10 ">
                                  <Link
                                    href={`products/view/${product?.slug}`}
                                    className="flex items-center gap-1.5 w-full px-5 py-2 text-left text-sm hover:text-orange-500"
                                  >
                                    <AiOutlineProduct className="text-lg text-orange-400" />{" "}
                                    View Product
                                  </Link>
                                  <Link
                                    href={`products/view-inventory/${product?._id}`}
                                    className="flex items-center gap-1.5 w-full px-5 py-2 text-left text-sm hover:text-orange-500"
                                  >
                                    <MdOutlineInventory2 className="text-lg text-orange-400" />{" "}
                                    View Inventory
                                  </Link>
                                  <Link
                                    href={`products/update/${product?.slug}`}
                                    className="flex items-center gap-1.5 w-full px-5 py-2 text-left text-sm  hover:text-orange-500"
                                  >
                                    <MdOutlineEdit className="text-lg text-orange-400" />{" "}
                                    Edit Product
                                  </Link>
                                  <Link
                                    href={`products/edit-inventory/${product?._id}`}
                                    className="flex items-center gap-1.5 w-full px-5 py-2 text-left text-sm  hover:text-orange-500"
                                  >
                                    <MdOutlineAutoFixHigh className="text-lg text-orange-400" />{" "}
                                    Edit Inventory
                                  </Link>
                                  <button
                                    className="flex items-center gap-1.5 w-full px-5 py-2 text-left text-sm  hover:text-orange-500"
                                    onClick={() =>
                                      setDeleteProduct(product._id)
                                    }
                                  >
                                    <MdDeleteOutline className="text-lg text-orange-400" />{" "}
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr className="h-4" />
                        </Fragment>
                      ))
                    ) : (
                      <tr className=" bg-white">
                        {" "}
                        <td colSpan={8} className=" py-5 px-4 text-center">
                          {" "}
                          Data not found
                        </td>{" "}
                      </tr>
                    )}
                  </tbody>
                ) : (
                  <tbody>
                    <tr className="bg-white">
                      <td colSpan={8} className="py-5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin text-orange-400 text-xl" />
                          <span>Loading...</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
            {(productData?.length> 0) && <div className="flex items-center gap-4 justify-center">
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
            </div>}
            <div className="flex items-center gap-1 justify-center mt-2">
              <span className="text-sm text-gray-500">{totalProducts} - total products | {totalPages} - total pages</span>
            </div>
          </div>

          <div className="w-[31%] flex flex-col gap-5 sticky top-24">
            <h3 className="text-xl font-semibold">Filter Products</h3>
            <div className="bg-white rounded-xl p-5 flex flex-col ">
              <div className="flex items-center justify-between cursor-pointer hover:text-orange-400" onClick={() => setShowSearch(!showSearch)}>
                <h3 className="font-medium">By Name</h3>
                <button
                  className={`hover:text-orange-500 ${
                    showSearch ? "rotate-180" : "rotate-0"
                  }`}
                  
                >
                  <FaAngleDown />
                </button>
              </div>
              <div
                className={`border-slate-300  rounded-lg  overflow-hidden flex items-center gap-2 ${
                  showSearch ? "h-auto mt-5 border-1 p-2.5 px-5" : "h-0 p-0"
                } `}
              >
                <input
                  type="text"
                  className="outline-none w-full"
                  placeholder="Enter product name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button className="text-orange-500 hover:text-orange-600">
                  <IoIosSearch className="text-xl" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 flex flex-col ">
              <div className="flex items-center justify-between hover:text-orange-400 cursor-pointer"  onClick={() => setShowCategory(!showCategory)}>
                <h3 className="font-medium">Categories</h3>
                <button
                  className={`hover:text-orange-500 ${
                    showCategory ? "rotate-180" : "rotate-0"
                  }`}
                 
                >
                  <FaAngleDown />
                </button>
              </div>
              <div className={`${showCategory ? "mt-5" : "hidden"} h-[50vh] overflow-y-scroll `}>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === 0}
                    onChange={() => setSelectedCategories([])}
                    className="accent-orange-500"
                  />
                  <span>All</span>
                </label>
                {categoryData?.map((item, i) => (
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(item._id)}
                      onChange={() => handleCategoryChange(item._id)}
                      className="accent-orange-500"
                    />
                    <span className="capitalize">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;

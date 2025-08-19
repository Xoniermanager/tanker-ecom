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

const ProductList = ({ categoryData, productData, totalPages, setCurrentPage, currentPage, deletePopupShow, setDeletePopupShow, setDeleteProduct, handleDelete, isLoading, errMessage }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  
  return (
    <>
      {deletePopupShow && <DeletePopup message={"Are you sure to delete product"}  onCancel={()=>setDeletePopupShow(false)} onDelete={handleDelete} isLoading={isLoading} errMessage={errMessage} />}
      <div className="w-full flex flex-col gap-10">
        <PageBar heading={"Product list"} />
        <div className="flex items-start gap-6">
          <div className="w-[69%] flex flex-col gap-3">
            <div className="bg-white p-4 flex justify-between items-center rounded-lg">
              <div className="flex items-center gap-5 ">
                <h3 className="capitalize font-medium">All products</h3>
                <select
                  name="productCount"
                  id="productCount"
                  className="p-2 w-22 rounded-lg border-1 border-slate-200"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>
              </div>
              <button className="px-5 py-2.5 bg-orange-400 rounded-lg font-semibold text-white hover:bg-orange-500">
                Actions
              </button>
            </div>

            <div className="mt-5   rounded-lg">
              <table className="min-w-full  text-left text-sm">
                <thead className="bg-[#f3f0ff]  uppercase text-xs ">
                  <tr>
                    <th className="p-4">
                      <input type="checkbox" className="accent-orange-500" />
                    </th>
                    
                    <th className="p-4">Photo</th>
                    <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                   <th className="p-4">Stock</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {productData?.map((product, index) => (
                    <Fragment key={index}>
                      <tr
                        style={{ borderRadius: "18px", overflow: "hidden" }}
                        className="bg-white shadow-sm rounded-xl overflow-hidden mb-4"
                      >
                        <td className="py-5 px-4 ">
                          <input
                            type="checkbox"
                            className="accent-orange-500"
                          />
                        </td>
                        
                        <td className="py-5 px-4">
                          <img
                            src={product.images[0].source}
                            alt={product.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="py-5 px-4 font-medium text-gray-800 capitalize truncate max-w-[150px]">
                          {product.name}
                        </td>
                        <td className="py-5 px-4"><span className="px-2 capitalize py-1 text-sm text-purple-800 font-medium bg-purple-100 rounded-lg  text-nowrap"> {product.category.name} </span></td>
                        <td className="py-5 px-4"> <span className="flex items-center gap-0.5 bg-orange-50 w-fit rounded-lg text-orange-500 px-2 py-1 font-medium"> <BiDollar /> {Number(product.sellingPrice).toFixed(2)}</span></td>
                        
                        <td className="py-5 px-4 font-medium">
                          <span
                            className={`${
                              product.inventory.status === "in_stock"
                                ? "text-green-500"
                                : "text-red-500"
                            } capitalize text-nowrap`}
                          >
                            {product.inventory?.status?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-5 px-4 relative" onMouseLeave={()=>setOpenMenuIndex(null)}>
                          <button
                            className="text-xl text-gray-500 hover:text-gray-700"
                            onClick={() => toggleMenu(index)}
                          >
                            <BsThreeDots />
                          </button>

                          {openMenuIndex === index && (
                            <div className="absolute right-4 top-12 w-42 bg-white  shadow-[0_0_15px_#00000030] rounded-lg py-2 z-10 ">
                              <Link href={`products/view/${product.slug}`} className="block w-full px-5 py-2 text-left text-sm hover:text-orange-500" >
                                View
                              </Link>
                              <Link href={`products/update/${product.slug}`} className="block w-full px-5 py-2 text-left text-sm  hover:text-orange-500" >
                                Edit
                              </Link>
                              <button className="block w-full px-5 py-2 text-left text-sm  hover:text-orange-500" onClick={()=>setDeleteProduct(product._id)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr className="h-4" />
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center ">
              {
                [...Array(totalPages)].map((item,i)=>(
                  <button className={` bg-orange-400  hover:bg-orange-400 hover:text-white  h-12 w-12 rounded-full border-white text-purple-950 font-bold border-1 border-dashed text-lg`} onClick={()=>setCurrentPage(i + 1)}>{i + 1} </button>
                ))
              }
            </div>
          </div>

          <div className="w-[31%] flex flex-col gap-5 sticky top-24">
            <h3 className="text-xl font-semibold">Filter Products</h3>
            <div className="bg-white rounded-xl p-5 flex flex-col ">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Keywords</h3>
                <button
                  className={`hover:text-orange-500 ${
                    showSearch ? "rotate-180" : "rotate-0"
                  }`}
                  onClick={() => setShowSearch(!showSearch)}
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
                  placeholder="Enter keywords"
                />
                <button className="hover:text-orange-500">
                  <IoIosSearch className="text-xl" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 flex flex-col ">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Categories</h3>
                <button
                  className={`hover:text-orange-500 ${
                    showCategory ? "rotate-180" : "rotate-0"
                  }`}
                  onClick={() => setShowCategory(!showCategory)}
                >
                  <FaAngleDown />
                </button>
              </div>
              <div className={`${showCategory ? "mt-5" : "hidden"}`}>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="accent-orange-500" />
                  <span>All</span>
                </label>
                {categoryData?.map((item,i)=>(

                
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="accent-orange-500"  />
                  <span>{item.name}</span>
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

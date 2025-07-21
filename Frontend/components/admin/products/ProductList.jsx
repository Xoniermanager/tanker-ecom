"use client";
import React, { useState, useEffect } from "react";
import PageBar from "../common/PageBar";
import { FaAngleDown } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Fragment } from "react";
import { BsThreeDots } from "react-icons/bs";

const ProductList = ({ categoryData }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };
  return (
    <>
      <div className="w-full flex flex-col gap-10">
        <PageBar heading={"Product list"} />
        <div className="flex items-start gap-6">
          <div className="w-[65%]">
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

            <div className="mt-5 overflow-x-auto rounded-lg">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f3f0ff]  uppercase text-xs ">
                  <tr>
                    <th className="p-4">
                      <input type="checkbox" className="accent-orange-500" />
                    </th>
                    <th className="p-4">ID</th>
                    <th className="p-4">Photo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    {
                      id: "#1",
                      name: "CLA-VAL",
                      status: "In Stock",
                      price: "$499,90",
                      date: "02/03/2025",
                      photo: "/images/img-2.jpg",
                    },
                    {
                      id: "#2",
                      name: "CIVACON",
                      status: "In Stock",
                      price: "$500,30",
                      date: "19/04/2025",
                      photo: "/images/img-2.jpg",
                    },
                    {
                      id: "#3",
                      name: "BAXTERS",
                      status: "Out of Stock",
                      price: "$1.190,90",
                      date: "30/05/2025",
                      photo: "/images/img-2.jpg",
                    },
                    {
                      id: "#4",
                      name: "Alord",
                      status: "In Stock",
                      price: "$50,90",
                      date: "25/03/2025",
                      photo: "/images/img-2.jpg",
                    },
                    {
                      id: "#5",
                      name: "CIVACON",
                      status: "In Stock",
                      price: "$50,90",
                      date: "28/03/2025",
                      photo: "/images/img-2.jpg",
                    },
                    {
                      id: "#6",
                      name: "CLA-VAL",
                      status: "Out of Stock",
                      price: "$10,50",
                      date: "05/04/2025",
                      photo: "/images/img-2.jpg",
                    },
                    {
                      id: "#7",
                      name: "CLA-VAL",
                      status: "Out of Stock",
                      price: "$10,50",
                      date: "05/04/2025",
                      photo: "/images/img-2.jpg",
                    },
                    {
                      id: "#8",
                      name: "CLA-VAL",
                      status: "Out of Stock",
                      price: "$10,50",
                      date: "05/04/2025",
                      photo: "/images/img-2.jpg",
                    },
                  ].map((product, index) => (
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
                        <td className="py-5 px-4 text-red-500 font-semibold">
                          {product.id}
                        </td>
                        <td className="py-5 px-4">
                          <img
                            src={product.photo}
                            alt={product.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="py-5 px-4 font-medium text-gray-800">
                          {product.name}
                        </td>
                        <td className="py-5 px-4 font-medium">
                          <span
                            className={`${
                              product.status === "In Stock"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-5 px-4">{product.price}</td>
                        <td className="py-5 px-4">{product.date}</td>
                        <td className="py-5 px-4 relative">
                          <button
                            className="text-xl text-gray-500 hover:text-gray-700"
                            onClick={() => toggleMenu(index)}
                          >
                            <BsThreeDots />
                          </button>

                          {openMenuIndex === index && (
                            <div className="absolute right-4 top-12 w-42 bg-white  shadow-[0_0_15px_#00000030] rounded-lg py-2 z-10 ">
                              <button className="block w-full px-5 py-2 text-left text-sm hover:text-orange-500">
                                View
                              </button>
                              <button className="block w-full px-5 py-2 text-left text-sm  hover:text-orange-500">
                                Edit
                              </button>
                              <button className="block w-full px-5 py-2 text-left text-sm  hover:text-orange-500">
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
          </div>

          <div className="w-[35%] flex flex-col gap-5 sticky top-24">
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
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="accent-orange-500" />
                  <span>Accessories</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-orange-500" />
                  <span>Wheels</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;

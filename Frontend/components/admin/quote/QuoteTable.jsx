import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { BsCartX } from "react-icons/bs";
import Link from "next/link";
import DataNotFount from "../../common/DataNotFount";
const QuoteTable = ({
  quoteData,
  setTotalPages,
  totalPages,
  currentPage,
  setCurrentPage,
  setPageLimit,
}) => {
  if (quoteData?.length <= 0) {
    return <DataNotFount />;
  }
  return (
    <>
      <div className="min-h-screen bg-[#f4f2ff] p-6">
        <div className="mb-4 bg-white p-4 px-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-black">Queries List</h2>
          <div className="text-sm text-gray-500 mt-1">
            <span className="text-orange-500 mr-1">Admin</span> &gt; Queries
          </div>
        </div>

        <div className="rounded-xl overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left border-separate border-spacing-y-4">
            <thead className="bg-[#f4f2ff]  uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {quoteData?.length > 0 ? (
                quoteData?.map((order, index) => (
                  <tr
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow"
                  >
                    <td className="px-6 py-6 capitalize">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-6 py-6 ">
                      <span className="bg-orange-500 px-2 py-1 text-white rounded-lg text-[12px] tracking-wide">
                        {order.email}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      {" "}
                      <span className="bg-green-50 text-green-500 px-3 py-1 text-sm rounded-lg">
                        {" "}
                        {order.phone}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-white bg-purple-900 px-3 py-1 text-[12px] rounded-lg">
                        {new Date(order.createdAt).toLocaleDateString("en-NZ", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    <td className="px-6 py-6 text-xl text-gray-500">
                      <Link
                        href={`quote/detail/${order._id}`}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-white bg-orange-500"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white rounded-xl overflow-hidden shadow">
                  <td colSpan={6} className="p-4 text-center">
                    {" "}
                    <p className="flex items-center gap-2 justify-center">
                      {" "}
                      <BsCartX className="text-lg text-orange-400" /> Queries Data
                      not found{" "}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center gap-4 justify-center mt-6">
            {[...Array(totalPages)].map((item, index) => (
              <button
                className={` ${
                  currentPage === index + 1
                    ? "bg-orange-400 text-white"
                    : "bg-[#f6e7d3]"
                } hover:bg-orange-400 hover:text-white  h-12 w-12 rounded-full border-white text-purple-950  font-bold border-1 border-dashed text-lg`}
                key={index}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={
                quoteData?.length <= 0 ||
                Number(totalPages) === Number(currentPage)
              }
              className={`h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] disabled:bg-[#507b86c5] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl ${
                quoteData?.length <= 0 && "hidden"
              }`}
              onClick={() => setCurrentPage(Number(currentPage) + 1)}
            >
              {" "}
              <IoArrowForward />{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteTable;

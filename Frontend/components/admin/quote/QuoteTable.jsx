import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
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
  handleDeleteQuote,
}) => {
  if (quoteData?.length <= 0) {
    return <DataNotFount />;
  }

  return (
    <>
      <div className="min-h-screen bg-[#f4f2ff]">
        <div className="mb-4 bg-white p-4 px-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-black">Queries List</h2>
          <div className="text-sm text-gray-500 mt-1">
            <span className="text-orange-500 mr-1">Admin</span> &gt; Queries
          </div>
        </div>

        <div className="rounded-xl overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left border-separate border-spacing-y-4">
            <thead className="bg-[#f4f2ff] uppercase text-xs">
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
                    <td className="px-6 py-6">
                      <span className="bg-orange-500 px-2 py-1 text-white rounded-lg text-[12px] tracking-wide">
                        {order.email}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="bg-green-50 text-green-500 px-3 py-1 text-sm rounded-lg">
                        {order.phone}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-white bg-purple-900 px-3 py-1 text-[12px] rounded-lg">
                        {new Date(order?.createdAt).toLocaleDateString("en-NZ", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    <td className="px-6 py-6 text-xl text-gray-500 flex items-center justify-center gap-2">
                      <Link
                        href={`quote/detail/${order?._id}`}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-white bg-orange-500 hover:bg-orange-600"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() =>
                          handleDeleteQuote(
                            order._id,
                            `${order.firstName} ${order.lastName}`
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 h-8 w-8 rounded-lg text-white flex items-center justify-center"
                      >
                        <MdDeleteOutline />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white rounded-xl overflow-hidden shadow">
                  <td colSpan={5} className="p-4 text-center">
                    <p className="flex items-center gap-2 justify-center">
                      <BsCartX className="text-lg text-orange-400" /> Queries
                      Data not found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

         
          {totalPages > 1 && (
            <div className="flex items-center gap-4 justify-center mt-10">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuoteTable;
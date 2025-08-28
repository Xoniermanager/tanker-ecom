"use client";
import React from "react";
import { FaBox, FaCheckCircle, FaClock, FaEdit } from "react-icons/fa";
import CountUp from "react-countup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { MdOutlineCloudUpload } from "react-icons/md";

const InventoryUpdate = ({
  inventoryData,
  handleChange,
  formData,
  handleSubmit,
  errMessage,
  isLoading,
  updateLoading
}) => {
  const router = useRouter();

  return (
    <div className="w-full mx-auto bg-white shadow-[0_0_10px_#00000020] rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between gap-10 mb-8">
        <h2 className="text-xl font-semibold text-purple-950 mb-5">
          Inventory Edit{" "}
        </h2>
        <div className="flex items-center gap-3">
        <Link href={`/admin/products/view/${inventoryData?.product?.slug}`} className="text-white font-medium bg-green-400  hover:bg-green-500 px-6 py-2.5 rounded-lg flex items-center gap-2" >  View Product </Link>
        <button
          className="text-white bg-purple-900  hover:bg-purple-950 font-medium px-6 py-2.5 flex items-center gap-2 rounded-lg"
          onClick={() => router.back()}
        >
          {" "}
         <IoChevronBack className="text-xl" /> Back{" "}
        </button></div>
      </div>

      <form
        className="bg-purple-50/70 rounded-lg p-5 px-7 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className=" grid grid-cols-2 gap-5 ">
          <div className="flex flex-col gap-3">
            <label className="capitalize text-sm text-purple-900">
              product name
            </label>
            <input
              type="text"
              value={inventoryData?.product?.name}
              className="bg-white capitalize rounded-lg px-4 border-1 border-purple-50 py-2 w-full"
              disabled
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="capitalize text-sm text-purple-900">
              Selling Price
            </label>
            <div className="bg-white rounded-lg  border-1 border-purple-50  w-full flex items-center gap-4 overflow-hidden">
              {" "}
              <div className="px-4 py-2 bg-stone-100 text-purple-900">$</div>
              <input
                type="text"
                className=" outline-none"
                value={inventoryData?.product?.sellingPrice}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="capitalize text-sm text-purple-900">
              product quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="bg-white rounded-lg px-4 border-1 border-purple-200 py-2.5 outline-none w-full "
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="capitalize text-sm text-purple-900">
              product status
            </label>
            <select
              type="text"
              name="status"
              value={formData?.status}
              onChange={handleChange}
              className={`bg-white rounded-lg px-4 border-1 border-purple-200 py-2.5 w-full capitalize outline-none`}
            >
              <option value="" hidden>
                select status
              </option>
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="pre_order">Pre Order</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          {errMessage && <p className="text-red-500">{errMessage}</p>}
        </div>
        <div className="flex justify-end">
          <button
            disabled={updateLoading}
            className="text-white bg-orange-500 font-medium  hover:bg-orange-600 disabled:bg-orange-300 px-6 py-2.5 flex items-center gap-2 rounded-lg"
            type="submit"
          >
            {" "} 
            {updateLoading ? "Updating..." : "Update"}{" "}<MdOutlineCloudUpload />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryUpdate;

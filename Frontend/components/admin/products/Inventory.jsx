import React from "react";
import { FaBox, FaCheckCircle, FaClock, FaEdit } from "react-icons/fa";
import CountUp from 'react-countup';
import Link from "next/link";

const Inventory = ({ inventoryData }) => {
  if (!inventoryData) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white shadow-[0_0_10px_#00000020] rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between gap-10">
      <h2 className="text-xl font-semibold text-purple-950 mb-5">Inventory View</h2>
      <Link href={''}>  </Link>
      </div>

      <div className="bg-purple-50/70 p-5 px-7 grid grid-cols-2 gap-5 rounded-lg">
        <div className="flex flex-col gap-3">
            <h4 className="capitalize text-sm text-purple-900">product name</h4>
            <span className="bg-white rounded-lg px-4 border-1 border-purple-200 py-2 w-full text-stone-600">{inventoryData.product.name}</span>
        </div>
        <div className="flex flex-col gap-3">
            <h4 className="capitalize text-sm text-purple-900">Selling Price</h4>
            <div className="bg-white rounded-lg  border-1 border-purple-200  w-full flex items-center gap-4 overflow-hidden"> <div className="px-4 py-2 bg-stone-100 text-purple-900">$</div>
            <span className="text-stone-600">{inventoryData?.product?.sellingPrice?.toFixed(2)}</span>
            </div>
        </div>
        <div className="flex flex-col gap-3">
            <h4 className="capitalize text-sm text-purple-900">product quantity</h4>
            <span className="bg-white rounded-lg px-4 border-1 border-purple-200 py-2 w-full text-stone-600"><CountUp start={0} end={Number(inventoryData.quantity)} duration={2}/> </span>
        </div>
        <div className="flex flex-col gap-3">
            <h4 className="capitalize text-sm text-purple-900">product status</h4>
            <span className={`bg-white rounded-lg px-4 border-1 border-purple-200 py-2 w-full ${inventoryData.status === "in_stock"?"text-green-500": "text-red-500"} capitalize`}>{inventoryData.status.split("_").join(" ")}</span>
        </div>

      </div>

     
      
    </div>
  );
};

export default Inventory;

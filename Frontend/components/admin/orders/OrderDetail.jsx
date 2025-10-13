"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaBox,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { ORDER_STATUS } from "../../../constants/enums";
const OrderDetail = ({
  orderData,
  orderStatus,
  setOrderStatus,
  handleStatusUpdate,
  isEditing,
  setIsEditing,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Pacific/Auckland",
    });
  };

  const order = orderData;

  const cancelled = orderData?.statusHistory?.find(status => status.status === 'cancelled');
  
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
       
        <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 mb-6 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-purple-950 mb-2">
                Order Details
              </h1>
              <p className="text-lg font-mono text-orange-500">
                {order.orderNumber}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(ORDER_STATUS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <FaSave size={18} />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 hover:bg-red-600 group text-white p-2 rounded-lg transition-colors"
                  >
                    <FaTimes size={18} className="group-hover:rotate-90" />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus?.charAt(0).toUpperCase() +
                      order.orderStatus?.slice(1)}
                  </span>
                  {order?.orderStatus !== "cancelled"  && <button
                    onClick={() => {
                      setOrderStatus(order.orderStatus);
                      setIsEditing(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <FaEdit size={18} />
                  </button>}
                </>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaClock size={16} />
              Created: {formatDate(order.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <FaClock size={16} />
              Updated: {formatDate(order.updatedAt)}
            </span>
          </div>
          {(cancelled?.status === "cancelled") && (
            <div className="p-4 bg-red-50 rounded-lg border-1 grid grid-cols-2 gap-6 border-red-400">
              <div className="flex item-center gap-2 ">
                <h2 className="font-semibold text-md capitalize">Order status: </h2>{" "}
                <span className="bg-red-400 px-3 py-1 text-sm rounded-full text-white w-fit capitalize">
                  {cancelled.status}
                </span>
              </div>
              <div className="flex item-center gap-2 ">
                <h2 className="font-semibold text-md capitalize">
                  Date of cancellation:{" "}
                </h2>{" "}
                <span className="bg-red-400 px-3 py-1 text-sm rounded-full text-white w-fit ">
                  {new Date(cancelled.changedAt).toLocaleDateString("en-NZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Pacific/Auckland",
                  })}
                </span>
              </div>
              <div className="flex item-center gap-2.5 ">
               <h2 className='font-semibold text-md capitalize '>cancelled by: </h2> <p className='text-gray-600 first-letter:capitalize'>{cancelled.note}</p>
            </div>
              <div className="flex item-center gap-2.5 ">
               <h2 className='font-semibold text-md capitalize '>Reason: </h2> <p className='text-gray-600'>{cancelled.reason || "no reason found"}</p>
            </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-4 flex items-center gap-2">
                <FaBox size={20} />
                Products
              </h2>
              <div className="space-y-4">
                {order.products.map((product, index) => (
                  <div
                    key={product._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-purple-900 capitalize">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Product ID: {product.product}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-400">
                        ${product.sellingPrice.toFixed(2)} × {product.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Subtotal: $
                        {(product.sellingPrice * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-stone-700 text-base font-medium">
                  <span>Shipping Price:</span>
                  <span className="text-stone-500">
                   {order.shippingPrice ? `$${order.shippingPrice.toFixed(2)}` : 'N/A' } 
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total ({order.totalQuantity} items):</span>
                  <span className="text-orange-500">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
                </div>
              </div>
            </div>

            
            <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt size={20} />
                Addresses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {" "}
                    <span className="text-red-500">*</span> Shipping Address
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p>{order.address.shippingAddress.address}</p>
                    <p>{order.address.shippingAddress.city}</p>
                    <p className="capitalize">
                      {order.address.shippingAddress.country} -{" "}
                      {order.address.shippingAddress.pincode}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    <span className="text-red-500">*</span> Billing Address
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p>{order.address.billingAddress.address}</p>
                    <p>{order.address.billingAddress.city}</p>
                    <p className="capitalize">
                      {order.address.billingAddress.country} -{" "}
                      {order.address.billingAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-4 flex items-center gap-2">
                <FaUser size={20} />
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className=" capitalize text-green-400">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <Link
                    href={`mailto:${order.email}`}
                    className="text-green-400 block hover:text-green-500"
                  >
                    {order.email}
                  </Link>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <Link
                    href={`tel:${order.phone}`}
                    className="text-green-400 hover:text-green-500 block"
                  >
                    {order.phone}
                  </Link>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Customer ID
                  </label>
                  <p className="text-green-400 font-mono text-sm">
                    {order.user}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-4 flex items-center gap-2">
                <FaCreditCard size={20} />
                Payment Information
              </h2>
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-500">
                    Payment Method
                  </label>
                  <p className=" px-3 py-1 text-sm w-fit rounded-md bg-purple-800 text-white capitalize">
                    {order.payment.method === "cod"
                      ? "Cash on Delivery"
                      : order.payment.method}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-500">
                    Payment Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.payment.status
                    )}`}
                  >
                    {order.payment.status.charAt(0).toUpperCase() +
                      order.payment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Total Amount
                  </label>
                  <p className="text-2xl font-bold text-purple-900 tracking-wide">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            
            <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-4">
                Order Meta
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono text-gray-900">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stock Reduced:</span>
                  <span
                    className={`font-semibold ${
                      order.stockReduced ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {order.stockReduced ? "Yes" : "No"}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-500">Version:</span>
                  <span className="text-gray-900">{order.__v}</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

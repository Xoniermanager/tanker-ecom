"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaRedo,
  FaArrowLeft,
  FaCalendarAlt,
  FaCreditCard,
  FaShoppingCart,
} from "react-icons/fa";
import PageLoader from "../../../../../components/common/PageLoader";
import api from "../../../../../components/user/common/api";
import { ORDER_STATUS } from "../../../../../constants/enums";
import DataNotFount from "../../../../../components/common/DataNotFount";

const page = () => {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const orderId = useSearchParams().get("orderId");

  const router = useRouter();

  const fetchOrderDetails = async (orderId) => {
    setIsLoading(true);
    setErrMessage(null);

    try {
      const response = await api.get(`/order/confirm-payment/${orderId}`);
      if (response.status === 200) {
        let data = response.data.data || null;
      
        if((data.paymentStatus === "requires_payment_method") || (data.paymentStatus ==="payment_failed") || (data.paymentStatus === "canceled")){

          setOrderData(data);
        }
        else if(data.paymentStatus === "succeeded"){
          router.push(`/orders/confirm?orderId=${orderId}`);
        }
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!orderData) {
    return <DataNotFount/>;
  }
  return (
    <div className="min-h-screen bg-violet-50/50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Failed Icon and Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FaExclamationTriangle className="w-20 h-20 text-red-500" />
              <div className="absolute inset-0 bg-red-100 rounded-full -z-10 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600">
            We couldn't process your payment. Please try again or use a
            different payment method.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Transaction Failed
                </h2>
                <p className="text-red-100">{orderData?.order?.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-red-100 text-sm">Attempted Amount</p>
                <p className="text-2xl font-bold">{orderData?.order?.totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Error Information */}
            <div className="bg-red-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Payment Error</h3>
              <p className="text-red-800 text-sm mb-2">
                {orderData?.message}
              </p>
              <p className="text-red-700 text-xs">
                Error Code: {orderData?.paymentStatus}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Attempt Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  Payment Attempt
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{orderData?.order?.payment?.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attempt Time</span>
                    <span className="font-medium">{orderData?.order?.payment?.failedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium text-red-600`}>{orderData?.order?.payment?.status}</span>
                  </div>
                </div>
              </div>

              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCalendarAlt className="w-5 h-5 mr-2 text-gray-600" />
                  Order Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Quantity</span>
                    <span className="font-medium">{orderData?.order?.totalQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Address</span>
                    <span className="font-medium text-right">
                      {orderData?.order?.address?.billingAddress?.address}
                      <br />
                      {orderData?.order?.address?.billingAddress?.city},{" "}
                      {orderData?.order?.address?.billingAddress?.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {/* <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Failed Order Items</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 font-medium">1x</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Premium Product Package</h4>
                      <p className="text-sm text-gray-600">Digital License</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$299.99</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Primary Actions */}
        {/* <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors">
            <FaRedo className="w-5 h-5 mr-2" />
            Retry Payment
          </button>
          <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            <FaCreditCard className="w-5 h-5 mr-2" />
            Different Payment Method
          </button>
        </div> */}

        {/* Common Reasons */}
        <div className="bg-amber-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-amber-900 mb-3">
            Common Reasons for Payment Failure
          </h3>
          <div className="space-y-2 text-sm text-amber-800">
            <p>• Insufficient funds in your account</p>
            <p>• Card expired or blocked by your bank</p>
            <p>• Incorrect card details entered</p>
            <p>• Daily transaction limit exceeded</p>
            <p>• International transactions blocked</p>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">What You Can Do</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Contact your bank to ensure the card is active</p>

            <p>• Check if you have sufficient balance</p>
            <p>• Verify your card details are correct</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={"/cart"}
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors flex-1"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
          <Link
            href={"/products"}
            className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex-1"
          >
            <FaShoppingCart className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Still having trouble? Contact our{" "}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              payment support
            </Link>{" "}
            team for assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;

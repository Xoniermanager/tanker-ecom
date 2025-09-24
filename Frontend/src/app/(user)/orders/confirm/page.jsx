"use client";
import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaDownload,
  FaEnvelope,
  FaArrowRight,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../../../components/user/common/api";
import PageLoader from "../../../../../components/common/PageLoader";
import Link from "next/link";
import FailedDataLoading from "../../../../../components/common/FailedDataLoading";

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
        if((data.paymentStatus === "succeeded")){
          setOrderData(data);
        }
        else{
         router.push(`/orders/failed?orderId=${orderId}`);
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
    return <FailedDataLoading/>;
  }

  return (
    <div className=" bg-violet-50 flex items-center justify-center px-4 py-18">
      <div className="max-w-3xl w-full">
       
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FaCheckCircle className="w-20 h-20 text-green-500" />
              <div className="absolute inset-0 bg-green-100 rounded-full -z-10 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed
          </p>
        </div>

        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Order Confirmed</h2>
                <p className="text-white">{orderData?.order?.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">Total Amount</p>
                <p className="text-2xl font-bold">${orderData?.order?.totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  Payment Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{orderData?.order?.payment?.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium">{orderData?.order?.payment?.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-medium">
                      {new Date(orderData?.order?.payment?.paidAt).toLocaleDateString(
                        "en-NZ",
                        {
                         year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Pacific/Auckland'
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCalendarAlt className="w-5 h-5 mr-2 text-gray-600" />
                  Delivery Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium">Sep 23-25, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Address</span>
                    <span className="font-medium text-right">
                      {orderData?.order?.address?.shippingAddress?.address}
                      <br />
                      {orderData?.order?.address?.shippingAddress?.city},{" "}
                      {orderData?.order?.address?.shippingAddress?.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
            {/* <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
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

        
        {/* <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            <FaDownload className="w-5 h-5 mr-2" />
            Download Receipt
          </button>
          <button className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
            <FaEnvelope className="w-5 h-5 mr-2" />
            Email Receipt
          </button>
        </div> */}

        
        {/* <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• You'll receive an email confirmation within 5 minutes</p>
            <p>• Track your order status in your account dashboard</p>
            <p>• We'll notify you once your order ships</p>
          </div>
        </div> */}

        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={'/products'} className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors flex-1">
            Continue Shopping
            <FaArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link href={`/orders`} className="flex items-center justify-center px-6 py-3  bg-white  text-gray-700 font-medium rounded-xl hover:bg-purple-900 hover:text-white transition-colors flex-1">
            View Order
          </Link>
        </div>

        {/* Support */}
        {/* <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need help? Contact our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              customer support
            </a>
            {' '}team
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default page;

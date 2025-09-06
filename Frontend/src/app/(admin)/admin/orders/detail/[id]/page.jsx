"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../../../../components/user/common/api";
import OrderDetail from "../../../../../../../components/admin/orders/OrderDetail";
import PageLoader from "../../../../../../../components/common/PageLoader";
import { toast } from "react-toastify";

const page = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false)

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/order/${id}`);
      if (response.status === 200 || response.status === 304) {
        const data = response.data.data;
        setOrderData(data);
        setOrderStatus(data.orderStatus);
      }
    } catch (error) {
      setError("Failed to fetch order details");
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true)
    try {
      
      const response = await api.patch(`/order/status/${orderData._id}`, {
        newStatus: orderStatus,
      });
      if (response.status === 200) {
        toast.success(`Order status changed to ${orderStatus} successfully`);
      }
      setOrderData({
        ...orderData,
        orderStatus: orderStatus
      })
      setIsEditing(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update order status";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="pl-72 pt-20 p-6 w-full bg-violet-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
          <button
            onClick={fetchOrder}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="pl-82 pt-20 p-6 w-full bg-violet-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No order data found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pl-82 pt-20 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <OrderDetail
          orderData={orderData}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          handleStatusUpdate={handleStatusUpdate}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isUpdating={isUpdating}
        />
      </div>
    </>
  );
};

export default page;

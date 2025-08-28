"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import api from "../../../../../../../components/user/common/api";
import PageLoader from "../../../../../../../components/common/PageLoader";
import InventoryUpdate from "../../../../../../../components/admin/products/InventoryUpdate";
import { toast } from "react-toastify";

const page = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null)
  const [formData, setFormData] = useState({
    quantity: 0,
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "quantity"){
        setFormData({ ...formData, [name]: Number(value) });
    }
    else{
        setFormData({ ...formData, [name]: value });
    }
  };


  const { id } = useParams();

  const fetchInventoryData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`products/${id}/inventory`);
      if (response.status === 200) {
        const inventoryData = response.data.data;
        setInventoryData(inventoryData);
        setFormData({
          quantity: inventoryData.quantity,
          status: inventoryData.status,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMessage(null)
   setUpdateLoading(true)
    try {
      const response = await api.put(`products/${id}/inventory`, formData);
      if (response.status === 200) {
        toast.success("Inventory updated successfully");
      }
    } catch (error) {
      console.log("error: ", error);
    }
    finally{
        setUpdateLoading(false)
    }
  };

  if (isLoading) {
    return <PageLoader inventoryData={inventoryData} />;
  }
  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 min-h-screen flex flex-col gap-6">
      <InventoryUpdate
        inventoryData={inventoryData}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errMessage={errMessage}
        isLoading={isLoading}
        updateLoading={updateLoading}
      />
    </div>
  );
};

export default page;

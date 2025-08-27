"use client";
import React, { useState, useEffect } from "react";
import PageBanner from "../../../../../components/user/common/PageBanner";
import CheckOut from "../../../../../components/user/cart/CheckOut";
import { useAuth } from "../../../../../context/user/AuthContext";
import { useCart } from "../../../../../context/cart/CartContext";
import api from "../../../../../components/user/common/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const page = () => {
  const { userData } = useAuth();
  const { cartData, discountPrice, withShippingChargesPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    billingAddress: {
      address: "",
      state: "",
      city: "",
      pincode: "",
    },
    shippingAddress: {
      address: "",
      state: "",
      city: "",
      pincode: "",
    },
    orderNotes: "",
    terms: false,
    paymentMethod: "cod",
  });

  useEffect(() => {
    setFormData({
      firstName:
        (userData?.fullName?.split(" ").length > 1
          ? userData?.fullName.split(" ").slice(0, -1).join(" ")
          : userData.fullName.split(" ").pop()) || "",
      lastName: userData.fullName.split(" ").pop() || "",
      email: userData.companyEmail || "",
      phone: Number(userData.mobileNumber) || "",
      billingAddress: {
        address: "",
        state: "",
        pincode: null,
      },
      shippingAddress: {
        address: "",
        state: "",
        pincode: null,
      },
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
  };

  const handleTerms = (e) => {
    setFormData({ ...formData, terms: !formData.terms });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const response = await api.post("/order");
      if (response.status === 200) {
        toast.success(`Your order placed successfully`);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          billingAddress: {
            address: "",
            state: "",
            city: "",
            pincode: "",
          },
          shippingAddress: {
            address: "",
            state: "",
            city: "",
            pincode: "",
          },
          orderNotes: "",
          terms: false,
          paymentMethod: "cod",
        });
        router.push('/')
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

  return (
    <>
      <PageBanner heading={"Check out"} />
      <CheckOut
        formData={formData}
        handleChange={handleChange}
        handleTerms={handleTerms}
        cartData={cartData}
        discountPrice={discountPrice}
        withShippingChargesPrice={withShippingChargesPrice}
        handleSubmit={handleSubmit}
        userData={userData}
        errMessage={errMessage}
      />
    </>
  );
};

export default page;

// pages/checkout/page.js (Fixed)
"use client";
import React, { useState, useEffect } from "react";
import PageBanner from "../../../../../components/user/common/PageBanner";
import CheckOut from "../../../../../components/user/cart/CheckOut";
import { useAuth } from "../../../../../context/user/AuthContext";
import { useCart } from "../../../../../context/cart/CartContext";
import api from "../../../../../components/user/common/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PAYMENT_METHODS } from "../../../../../constants/enums";

const Page = () => {
  const { userData } = useAuth();
  const {
    cartData,
    discountPrice,
    withShippingChargesPrice,
    fetchCartData,
    shippingPrice,
    setShippingPrice,
    setSelectedCountry, // Get this from context
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [addressIsSame, setAddressIsSame] = useState(true);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingCharges, setShippingCharges] = useState(0);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    products: [],
    shippingAddress: {
      address: "",
      country: "NZ",
      city: "",
      pincode: "",
    },
    billingAddress: {
      address: "",
      country: "NZ",
      city: "",
      pincode: "",
    },
    orderNotes: "",
    terms: false,
    paymentMethod: PAYMENT_METHODS.ONLINE_PAYMENT,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName:
        (userData?.fullName?.split(" ").length > 1
          ? userData?.fullName?.split(" ").slice(0, -1).join(" ")
          : userData?.fullName?.split(" ").pop()) || "",
      lastName: userData?.fullName?.split(" ").pop() || "",
      email: userData?.companyEmail || "",
      phone: Number(userData?.mobileNumber) || "",
      products: cartData
        ? cartData?.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            sellingPrice: item.product.sellingPrice,
          }))
        : [],
    }));
  }, [userData, cartData]);

  const handleChange = (e) => {
    setErrMessage(null);
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: child === "pincode" ? Number(value) : value,
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

  // Update country in context and adjust payment method
  useEffect(() => {
    const country = formData.shippingAddress.country;
    
    // Update the selected country in the cart context
    if (setSelectedCountry) {
      setSelectedCountry(country);
    }

    if (country === "NZ") {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: PAYMENT_METHODS.ONLINE_PAYMENT,
      }));
    } else if (country && country !== "NZ") {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: PAYMENT_METHODS.COD,
      }));
      // Shipping price will be automatically set to 0 by the context
    }
  }, [formData.shippingAddress.country, setSelectedCountry]);

  const handleSubmit = async (e, returnOrderData = false) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: String(formData.phone),
        products: formData.products,
        address: {
          shippingAddress: formData.shippingAddress,
          billingAddress: addressIsSame
            ? formData.shippingAddress
            : formData.billingAddress,
        },
        paymentMethod: formData.paymentMethod,
        shippingPrice: shippingPrice,
        orderNotes: formData.orderNotes,
      };

      const response = await api.post("/order", payload);

      if (response.status === 200) {
        const orderData = response.data.data;

        if (returnOrderData) {
          return {
            orderId: orderData._id,
            ...orderData,
          };
        } else {
          toast.success("Your order placed successfully");
          fetchCartData();
          resetForm();
          router.push("/orders");
        }
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      setErrMessage(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitQuote = async () => {
    setIsLoading(true);
    setErrMessage(null);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: String(formData.phone),
        products: formData.products,
        address: {
          shippingAddress: formData.shippingAddress,
          billingAddress: addressIsSame
            ? formData.shippingAddress
            : formData.billingAddress,
        },
        paymentMethod: PAYMENT_METHODS.COD,
        orderNotes: formData.orderNotes,
      };

      const response = await api.post("/order", payload);

      if (response.status === 200) {
        toast.success("Your order quote send successfully");
        fetchCartData();
        resetForm();
        router.push("/orders");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      setErrMessage(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      products: [],
      billingAddress: { address: "", country: "", city: "", pincode: "" },
      shippingAddress: { address: "", country: "", city: "", pincode: "" },
      orderNotes: "",
      terms: false,
      paymentMethod: "cod",
    }));
  };

  const handlePaymentSuccess = (orderId) => {
    toast.success("Payment completed successfully!");
    fetchCartData();
    resetForm();
    router.push(`/orders/confirm?orderId=${orderId}`);
  };

  const onPaymentFailed = (orderId) => {
    toast.error("Payment Failed!");
    router.push(`/orders/failed?orderId=${orderId}`);
    resetForm();
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
        isLoading={isLoading}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={onPaymentFailed}
        shippingPrice={shippingPrice}
        addressIsSame={addressIsSame}
        setAddressIsSame={setAddressIsSame}
        handleSubmitQuote={handleSubmitQuote}
        shippingLoading={shippingLoading}
      />
    </>
  );
};

export default Page;
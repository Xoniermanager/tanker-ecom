// pages/checkout/page.js (Simplified)
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
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [addressIsSame, setAddressIsSame] = useState(true);
  const [shippingLoading, setShippingLoading] = useState(false)
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

  const getShippingCharges = async () => {
  setShippingLoading(true)
  try {
   
    const items = cartData || [];
    
   
    if (!items.length) {
      console.warn("No items found in cartData for shipping calculation.");
      return;
    }

    const payload = {
      destination: {
        address: {
          suburb: formData?.shippingAddress?.address || "",
          postCode: String(formData?.shippingAddress?.pincode || ""),
          city: formData?.shippingAddress?.city || "",
          countryCode: formData?.shippingAddress?.country || "",
        },
      },
      freightDetails: items.map((item) => ({
          units: String(item?.quantity) ?? "0",
          packTypeCode: item?.product?.specifications?.packTypeCode ?? "",
          height: item?.product?.specifications?.height ?? "0",
          length: item?.product?.specifications?.length ?? "0",
          width: item?.product?.specifications?.width ?? "0",
          weight: item?.product?.specifications?.weight ?? "0",
          volume: item?.product?.specifications?.volume ?? "0",
        })),
    };

    const response = await api.post(`/shipping-charges`, payload);

    if (response.status === 200 && Array.isArray(response.data?.data?.charges)) {
      const lastCharge = response.data.data.charges.pop();
      
      setShippingPrice(lastCharge.value);
    } else {
      console.warn("Unexpected response format from shipping-charges API:", response.data);
    }

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching shipping charges:", error);
    }
  } finally{
    setShippingLoading(false)
  }
};


  useEffect(() => {
  const { address, city, country, pincode } = formData.shippingAddress;
  console.log("Shipping fields:", address, city, country, pincode);
  if (address && city && country && (String(pincode).length > 3) && (country === "NZ")) {
    
    getShippingCharges();
  }
}, [formData.shippingAddress]);

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

  useEffect(() => {
  const country = formData.shippingAddress.country;
  

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
    setShippingPrice(0)
  }

}, [formData.shippingAddress.country]);


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
    // e.preventDefault();
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
        // const orderData = response.data.data;
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

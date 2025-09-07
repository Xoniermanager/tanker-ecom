"use client";
import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContext.js";
import api from "../../components/user/common/api.js";
import { useAuth } from "../user/AuthContext.js";
import { toast } from "react-toastify";

const CartContextProvider = ({ children }) => {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchCartData = async () => {
    if (!isAuthenticated) {
      const guestCart = localStorage.getItem("guestCart");
      if(guestCart){
        setCartData(JSON.parse(guestCart));
      }
    }
    setIsLoading(true);
    try {
      const response = await api.get(`/cart`);
      if (response.status === 200 || response.status === 304) {
        setCartData(response?.data?.data?.items);
      }
    } catch (error) {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const increaseCount = (id, count = 1) => {
    if (!id) return;

    const targetItem = cartData.find((item) => item.product._id === id);

    if (!targetItem) {
      toast.error("Item not found in cart");
      return;
    }
    const newQuantity = targetItem.quantity + count;

    if (isAuthenticated) {
      const availableQuantity = targetItem.product.inventory?.quantity || 0;

      if (newQuantity > availableQuantity) {
        toast.info(`Only ${availableQuantity} items available in stock`);
        return;
      }
    }

    const updatedItems = cartData.map((item) =>
      item.product._id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartData(updatedItems);
  };

  const decreesCount = (id, count = 1) => {
    if (!id) return;

    const updatedItems = cartData.map((item) =>
      item.product._id === id && item.quantity > count
        ? { ...item, quantity: item.quantity - count }
        : item
    );

    setCartData(updatedItems);
  };

  const count =
    cartData &&
    cartData?.reduce((acc, init) => Number(acc) + Number(init?.quantity), 0);

  const discountPrice = cartData?.reduce(
    (acc, init) =>
      Number(acc) + Number(init?.product?.sellingPrice) * init?.quantity,
    0
  );
  const regularPrice = cartData?.reduce(
    (acc, init) =>
      Number(acc) + Number(init?.product?.regularPrice) * init?.quantity,
    0
  );
  const withShippingChargesPrice =
    Number(discountPrice) + Number(process.env.NEXT_PUBLIC_SHIPPING_PRICE);
  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartData,
        setCartData,
        isLoading,
        decreesCount,
        increaseCount,
        count,
        fetchCartData,
        regularPrice,
        discountPrice,
        withShippingChargesPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;

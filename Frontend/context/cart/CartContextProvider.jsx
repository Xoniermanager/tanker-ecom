"use client";
import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContext.js";
import api from "../../components/user/common/api.js";
import { useAuth } from "../user/AuthContext.js";
import { toast } from "react-toastify";
import { useSite } from "../siteData/SiteDataContext.js";

const CartContextProvider = ({ children }) => {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSyncedGuestCart, setHasSyncedGuestCart] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("NZ"); 

  const { isAuthenticated } = useAuth();

  const fetchCartData = async () => {
    if (!isAuthenticated) {
      const guestCart = localStorage.getItem("guestCart");
      if (guestCart) {
        setCartData(JSON.parse(guestCart));
      }
      return;
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

  const syncGuestCartWithServer = async () => {
    if (!isAuthenticated || hasSyncedGuestCart) return;
    
    const localCart = localStorage.getItem("guestCart")
      ? JSON.parse(localStorage.getItem("guestCart"))
      : [];

    if (localCart.length > 0) {
      const payload = localCart.map((item) => {
        return { productId: item.product._id, quantity: item.quantity };
      });

      try {
        const response = await api.post("/cart/sync", {
          localCart: payload,
        });
        
        if (response.status === 200) {
          localStorage.removeItem("guestCart");
          // toast.success("Cart synced successfully!");
          setHasSyncedGuestCart(true);
          await fetchCartData();
        }
      } catch (error) {
        const message =
          (Array.isArray(error?.response?.data?.errors) &&
            error.response.data.errors[0]?.message) ||
          error?.response?.data?.message ||
          "Something went wrong syncing cart";
       
        toast.info(message);
        localStorage.removeItem("guestCart");
        setHasSyncedGuestCart(true);
        await fetchCartData();
      }
    } else {
      setHasSyncedGuestCart(true);
      await fetchCartData();
    }
  };

 
  useEffect(() => {
    
    if (selectedCountry === "NZ") {
      const price = cartData?.reduce((acc, item) => {
        // return acc + ((item?.product?.shippingCharge || 0) * (item?.quantity || 1));
        return acc + item?.product?.shippingCharge ;
      }, 0);
      setShippingPrice(price || 0);
    } else {
      
      setShippingPrice(0);
    }
  }, [cartData, selectedCountry]);

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
    Number(discountPrice) + Number(shippingPrice);

  useEffect(() => {
    if (isAuthenticated && !hasSyncedGuestCart) {
      syncGuestCartWithServer();
    } else if (!isAuthenticated) {
      fetchCartData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setHasSyncedGuestCart(false);
    }
  }, [isAuthenticated]);

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
        shippingPrice,
        setShippingPrice,
        syncGuestCartWithServer,
        selectedCountry,
        setSelectedCountry, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
"use client";
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../components/user/common/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useCart } from "../cart/CartContext";
import { useRouter } from "next/navigation";

const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const popup = withReactContent(Swal);

  const router = useRouter();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/auth/me`);
      if (response.status === 200) {
        setUserData(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
       setIsAuthenticated(false)
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        console.error(error);
       
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    const result = await popup.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await api.post(`/auth/logout`, {});
      if (response.status === 200) {
        toast.success("User logged out successfully");
        setUserData(null);
        setIsAuthenticated(false);
        router.push("/");
        
      }
    } catch (error) {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        console.error(error);
        toast.error("User not logged out yet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const localCart = localStorage.getItem("guestCart")
        ? JSON.parse(localStorage.getItem("guestCart"))
        : [];

      const payload = localCart.map((item) => {
        return { productId: item.product._id, quantity: item.quantity };
      });

      if (localCart.length > 0) {
        (async function submitGuestCart() {
          try {
            const response = await api.post("/cart/sync", {
              localCart: payload,
            });
            if (response.status === 200) {
              localStorage.removeItem("guestCart");
              
            }
          } catch (error) {
            const message =
              (Array.isArray(error?.response?.data?.errors) &&
                error.response.data.errors[0]?.message) ||
              error?.response?.data?.message ||
              "Something went wrong";
           
            toast.info(message);
            localStorage.removeItem("guestCart");
            
          }
        })();
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userData,
        isAuthenticated,
        handleLogout,
        fetchUserData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

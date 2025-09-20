"use client";
import { useEffect, useState } from "react";
import { DashboardContext } from "./DashboardContext";
import api from "../../components/user/common/api";
import { useAuth } from "../user/AuthContext";

export const DashBoardContextProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardAllData, setDashboardAllData] = useState(null);
  const [topSellingProductsData, setTopSellingProductData] = useState(null);
  const [topSellingCategories, setTopSellingCategories] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [weeklySale, setWeeklySale]= useState(null);
  const [monthlySaleswithOrder, setMontlySaleWithOrder] = useState(null)

  const month = Number(new Date().getMonth()) + 1 

  const [salesQueryMonth, setSalesQueryMonth] = useState(Number(month))
  const [timeframe, setTimeframe] = useState(30);

  const {isAuthenticated} = useAuth()

  const fetchDashboardData = async () => {
    setIsDashboardLoading(true);
    setErrMessage(null);
    try {
      const response = await api.get(`/dashboard?timeframe=${timeframe}&month=${salesQueryMonth}`);
      if (response.status === 200) {
        setDashboardData(response?.data?.data?.data);
        setDashboardAllData(response?.data?.data);
        setTopSellingProductData(response?.data?.data?.data?.topSellingProducts)
        setTopSellingCategories(response?.data?.data?.data?.topSellingCategories)
        setWeeklySale(response?.data?.data?.data?.weeklyOrderCount)
        setMontlySaleWithOrder(response?.data?.data?.data?.orderSaleCountWithSale)
       
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error?.response?.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";

      setErrMessage(message);
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        console.error(error);
      }
    } finally {
      setIsDashboardLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe, salesQueryMonth, isAuthenticated]);

  return (
    <DashboardContext.Provider value={{dashboardData, isDashboardLoading, weeklySale, topSellingProductsData, topSellingCategories, monthlySaleswithOrder, setSalesQueryMonth, salesQueryMonth}}>{children}</DashboardContext.Provider>
  );
};

import React from "react";
import AuthContextProvider from "./user/AuthContextProvider";
import CartContextProvider from "./cart/CartContextProvider";
import { DashBoardContextProvider } from "./dashboard/DashboardContextProvider";


const Providers = ({ children }) => {
  return (
    <>
      <AuthContextProvider>
        <CartContextProvider>
          <DashBoardContextProvider>
          {children}
         </DashBoardContextProvider>
        </CartContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default Providers;

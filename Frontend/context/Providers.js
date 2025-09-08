import React from "react";
import AuthContextProvider from "./user/AuthContextProvider";
import CartContextProvider from "./cart/CartContextProvider";
import { DashBoardContextProvider } from "./dashboard/DashboardContextProvider";
import SiteDataContextProvider from "./siteData/SiteDataContextProvider";


const Providers = ({ children }) => {
  return (
    <>
      <AuthContextProvider>
        <CartContextProvider>
          <DashBoardContextProvider>
            <SiteDataContextProvider>
          {children}
          </SiteDataContextProvider>
         </DashBoardContextProvider>
        </CartContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default Providers;

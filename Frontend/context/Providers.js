import React from "react";
import AuthContextProvider from "./user/AuthContextProvider";
import CartContextProvider from "./cart/CartContextProvider";
import { DashBoardContextProvider } from "./dashboard/DashboardContextProvider";
import SiteDataContextProvider from "./siteData/SiteDataContextProvider";


const Providers = ({ children }) => {
  return (
    <><SiteDataContextProvider>
      <AuthContextProvider>
        <CartContextProvider>
          <DashBoardContextProvider>
            
          {children}
         
         </DashBoardContextProvider>
        </CartContextProvider>
      </AuthContextProvider>
       </SiteDataContextProvider>
    </>
  );
};

export default Providers;

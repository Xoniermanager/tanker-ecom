import React from "react";
import AuthContextProvider from "./user/AuthContextProvider";
import CartContextProvider from "./cart/CartContextProvider";


const Providers = ({ children }) => {
  return (
    <>
      <AuthContextProvider>
        <CartContextProvider>
          
          {children}
         
        </CartContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default Providers;

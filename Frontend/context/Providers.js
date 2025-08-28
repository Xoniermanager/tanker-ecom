import React from "react";
import AuthContextProvider from "./user/AuthContextProvider";
import CartContextProvider from "./cart/CartContextProvider";
import OrderContextProvider from "./order/OrderContextProvider";

const Providers = ({ children }) => {
  return (
    <>
      <AuthContextProvider>
        <CartContextProvider>
          <OrderContextProvider>
          {children}
          </OrderContextProvider>
        </CartContextProvider>
      </AuthContextProvider>
    </>
  );
};

export default Providers;

"use client"
import { createContext, useContext } from "react";

const OrderContext = createContext();

const useOrder = ()=>{
    return useContext(OrderContext)
}

export {useOrder, OrderContext}
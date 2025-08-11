"use client";
import React, { useState, useEffect } from "react";
import ProductList from "../../../../../components/admin/products/ProductList";

const page = () => {
  const [categoryData, setCategoryData] = useState(null);

  // get category data

  const getCategories = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <ProductList categoryData={categoryData} />
      </div>
    </>
  );
};

export default page;

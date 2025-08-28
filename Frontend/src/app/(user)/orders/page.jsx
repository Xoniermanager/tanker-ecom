"use client";
import React, { useState } from "react";
import PageBanner from "../../../../components/user/common/PageBanner";

import OrderTable from "../../../../components/user/orders/OrderTable";

const page = () => {
  


  return (
    <>
      <PageBanner heading={"Order"} />
      <OrderTable />
      
    </>
  );
};

export default page;

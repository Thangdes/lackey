"use client";

import { Suspense } from "react";
import CheckoutClient from "@/components/checkout/CheckoutClient";

const CheckoutPage = () => {
  
  

  return (
    <Suspense fallback={null}>
      <div className="">
        <CheckoutClient />
      </div>
    </Suspense>
  );
};

export default CheckoutPage;
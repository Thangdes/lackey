"use client";

import { Suspense } from "react";
import CheckoutClient from "@/components/checkout/CheckoutClient";

const CheckoutPage = () => {
  // Always render checkout for testing, regardless of cart state or loading
  // (Server is currently not working; client-side guards are disabled temporarily.)

  return (
    <Suspense fallback={null}>
      <div className="">
        <CheckoutClient />
      </div>
    </Suspense>
  );
};

export default CheckoutPage;
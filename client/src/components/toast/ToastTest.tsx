"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast, showInfoToast } from "./AppToast";
import { showAddedToCartToast } from "./AddToCartToast";

export default function ToastTest() {
  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white p-6 rounded-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] max-w-xs">
      <div className="font-[family-name:var(--font-retro)] text-lg font-bold mb-4 uppercase tracking-wide">
        Toast Test
      </div>
      
      <div className="space-y-2">
        <div className="text-xs font-bold mb-1 text-gray-600 uppercase tracking-wide">Custom Toasts:</div>
        
        <Button
          size="sm"
          className="w-full text-xs"
          onClick={() => showSuccessToast({ 
            title: "Success!", 
            message: "Operation completed successfully" 
          })}
        >
          Success Toast
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          className="w-full text-xs"
          onClick={() => showErrorToast({ 
            title: "Error!", 
            message: "Something went wrong" 
          })}
        >
          Error Toast
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="w-full text-xs"
          onClick={() => showInfoToast({ 
            title: "Info", 
            message: "Here is some information" 
          })}
        >
          Info Toast
        </Button>
        
        <Button
          size="sm"
          className="w-full text-xs"
          onClick={() => showAddedToCartToast({
            name: "Hạt điều rang muối (500g)",
            thumbnailUrl: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1735747287/hf3qhpokohqyhstbwgvm.jpg",
            quantity: 2
          })}
        >
          Add to Cart Toast
        </Button>

        <div className="border-t border-gray-300 my-3 pt-3">
          <div className="text-xs font-bold mb-1 text-gray-600 uppercase tracking-wide">Default Sonner:</div>
        </div>

        <Button
          size="sm"
          className="w-full text-xs"
          onClick={() => toast.success("Success", { 
            description: "Your action was successful" 
          })}
        >
          Default Success
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          className="w-full text-xs"
          onClick={() => toast.error("Network Error", { 
            description: "Failed to connect to server" 
          })}
        >
          Network Error
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="w-full text-xs"
          onClick={() => toast.warning("Warning", { 
            description: "Please check your input" 
          })}
        >
          Default Warning
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="w-full text-xs"
          onClick={() => toast.info("Info", { 
            description: "This is an information message" 
          })}
        >
          Default Info
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs"
          onClick={() => toast("Simple Message", { 
            description: "No icon toast" 
          })}
        >
          Simple Toast
        </Button>
      </div>
    </div>
  );
}

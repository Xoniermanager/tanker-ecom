// app/loading.tsx or app/page.tsx depending on your structure
"use client";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
      </div>
    </div>
  );
};

export default Loading;


"use client";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../../user/common/api";
import { BiGhost } from "react-icons/bi";

const UploadingLogo = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a logo file first.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedFile);

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const response = await api.put("/site-settings/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Logo uploaded successfully!");
        onUploadSuccess && onUploadSuccess(response.data.data);

        handleRemove();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to upload logo.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white  w-full">
        <div className="mb-7 flex flex-col gap-2">
      <h2 className="font-semibold text-2xl text-purple-950 flex items-center gap-2 ">
        <BiGhost className="text-2xl text-orange-500"/> Upload website logo
      </h2>
      <p className="text-slate-500 text-sm">Make sure logo size should be max width <span className="text-orange-400"> 200px </span> and max height <span className="text-orange-400">74px </span></p>
      </div>
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        className="border border-neutral-200 bg-white rounded-lg py-2.5 px-5 outline-none"
        ref={fileInputRef}
        onChange={handleFileChange}
        
      />

      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Logo Preview"
            className="w-32 h-32 object-contain border border-slate-400 rounded"
          />
          <button
            type="button"
            className="block mt-2 text-red-600 underline"
            onClick={handleRemove}
          >
            Remove Preview
          </button>
        </div>
      )}
      </div>

      {errorMessage && (
        <p className="text-red-500 mb-4">{errorMessage}</p>
      )}

      <button
        className={`px-6 py-2.5 bg-purple-900 disabled:bg-purple-300 flex items-center gap-2 text-white rounded ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
      >
        {isUploading ? "Uploading..." : "Upload Logo"} 
      </button>
      </div>
    </div>
  );
};

export default UploadingLogo;

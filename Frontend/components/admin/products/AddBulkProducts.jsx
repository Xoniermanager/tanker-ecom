"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  MdUpload,
  MdDescription,
  MdClose,
  MdVisibility,
  MdDownload,
  MdError,
  MdCheckCircle,
  MdRefresh,
  MdContentCopy,
} from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import api from "../../user/common/api";
import { toast } from "react-toastify";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const AddBulkProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [categories, setCategories] = useState([]);
  const [isCopy, setIsCopy] = useState(null);

  const sampleHeaders = [
    "Part No.",
    "Name",
    "Category",
    "Regular Price",
    "Selling Price",
    "Brand",
    "Origin",
    "Quantity",
    "Highlights",
    "Description",
    "Short Description",
    "Delivery Days",
    "Shipping Charge"
  ];
    const getSampleData = () => {
    const availableCategories =
      categories.length > 0
        ? categories
        : [{ name: "Electronics" }, { name: "I Phone" }, { name: "Poco" }];

    return [
      [
        "021-TS0769-90MM",
        "iPhone 14 Pro",
        availableCategories[1]?.name || "I Phone",
        "999.99",
        "899.99",
        "Apple",
        "United States",
        "50",
        "Latest A16 chip; Pro camera system; Dynamic Island",
        "Latest iPhone with Pro features and advanced camera capabilities",
        "Premium smartphone with cutting-edge technology",
        "3",
        "20.33"
        
      ],
      [
        "021-TS0769-90MM2",
        "Samsung Galaxy S23 Ultra",
        availableCategories[2]?.name || "Poco",
        "1199.99",
        "1099.99",
        "Samsung",
        "South Korea",
        "30",
        "S Pen included; 200MP camera; 5G ready",
        "Flagship Android smartphone with S Pen and exceptional camera quality",
        "Ultimate Android experience with S Pen",
        "2",
        "12.34"
      ],
      [
        "121-TS0769-90MM",
        "MacBook Air M2",
        availableCategories[0]?.name || "Electronics",
        "1299.99",
        "1199.99",
        "Apple",
        "United States",
        "25",
        "M2 chip; Lightweight design; All-day battery",
        "Lightweight laptop with M2 chip for exceptional performance and battery life",
        "Powerful and portable laptop for professionals",
        "9",
        "11.11"
        
      ],
      [
        "021-TS0769-90MMER",
        "Sony WH-1000XM5",
        availableCategories[0]?.name || "Electronics",
        "399.99",
        "349.99",
        "Sony",
        "Japan",
        "100",
        "Noise cancelling; 30-hour battery; Premium sound",
        "Industry-leading noise canceling headphones with premium sound quality",
        "Premium wireless headphones with noise cancelling",
        "8",
        "8.21"
        
      ],
      [
        "021-TS0369-90MMOL",
        "Dell XPS 13",
        availableCategories[0]?.name || "Electronics",
        "1099.99",
        "999.99",
        "Dell",
        "United States",
        "40",
        "InfinityEdge display; Intel Core i7; Ultra-portable",
        "Premium ultrabook with stunning display and powerful performance",
        "Compact and powerful ultrabook for productivity",
        "6",
        "23.44"
      ],
    ];
  };

  const getCategoryData = async (req, res) => {
    try {
      const response = await api.get(`/product-categories/active`);
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setErrors(["Please upload a CSV file"]);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setSuccessMessage("");
    parseCSV(selectedFile);
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length === 0) {
        setErrors(["CSV file is empty"]);
        return;
      }

      const headers = lines[0]
        .split(",")
        .map((header) => header.trim().replace(/"/g, ""));
      const data = lines
        .slice(1)
        .map((line) =>
          line.split(",").map((cell) => cell.trim().replace(/"/g, ""))
        );

      if (data.length > 0) {
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        setCurrentPage(1);
      }

      setHeaders(headers);
      setCsvData(data);
      setShowPreview(true);

      const validationErrors = [];
      if (data.length === 0) {
        validationErrors.push("No product data found in CSV");
      }
      if (headers.length < 12) {
        validationErrors.push("CSV should have all 12 required columns");
      }

      if (categories.length > 0) {
        const categoryNames = categories.map((cat) => cat.name.toLowerCase());
        const invalidCategories = [];

        data.forEach((row, index) => {
          const categoryIndex = headers.findIndex((h) =>
            h.toLowerCase().includes("category")
          );
          if (categoryIndex !== -1 && row[categoryIndex]) {
            const rowCategory = row[categoryIndex].toLowerCase();
            if (!categoryNames.includes(rowCategory)) {
              invalidCategories.push(
                `Row ${index + 2}: "${row[categoryIndex]}"`
              );
            }
          }
        });

        // if (invalidCategories.length > 0) {
        //   validationErrors.push(
        //     `Invalid categories found: ${invalidCategories
        //       .slice(0, 3)
        //       .join(", ")}${
        //       invalidCategories.length > 3
        //         ? ` and ${invalidCategories.length - 3} more`
        //         : ""
        //     }`
        //   );
        // }
      }

      setErrors(validationErrors);
    };
    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const sampleData = getSampleData();
    const csvContent = [
      sampleHeaders.join(","),
      ...sampleData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk_products_sample.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const removeFile = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setShowPreview(false);
    setErrors([]);
    setSuccessMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFileOnSubmit = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setShowPreview(false);
    setErrors([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyCategoryText = (text, i) => {
    navigator.clipboard.writeText(text || "not found");
    setIsCopy(i);
    setTimeout(() => setIsCopy(false), 4000);
  };

  const handleSubmit = async () => {
    if (!file || csvData.length === 0) {
      setErrors(["Please upload a valid CSV file"]);
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("csvFile", file);

      formData.append(
        "productData",
        JSON.stringify({
          headers,
          data: csvData,
        })
      );

      const response = await api.post("/products/bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        const { successful, failed, errors } = response.data.data;

        toast.success(
          `Successfully uploaded ${successful} products!${
            failed > 0 ? ` ${failed} products failed` : ""
          }`
        );
        setSuccessMessage(
          `Successfully uploaded ${successful} products!${
            failed > 0 ? ` ${failed} products failed` : ""
          }`
        );
        if (errors && errors.length > 0) {
          const errorMessages = errors
            .slice(0, 5)
            .map((err) => `Row ${err.row}: ${err.error}`);
          setErrors(errorMessages);
        }
        removeFileOnSubmit();
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrors([message]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaginationButtons = () => {
  if (totalPages <= 3) {
    
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  if (currentPage === 1) {
   
    return [1, 2, 3]
  } else if (currentPage === totalPages) {
    
    return [totalPages - 2, totalPages - 1, totalPages]
  } else {
    
    return [currentPage - 1, currentPage, currentPage + 1]
  }
}

  return (
    <div className="w-full p-10 bg-white rounded-xl shadow-[0_0_15px_#00000015] flex flex-col gap-10">
      <div className="text-start">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Bulk Product Upload
        </h2>
        <p className="text-gray-600">
          Upload your products in bulk using CSV files
        </p>
      </div>

      {categories.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MdCheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 mb-2">
                Available Categories
              </h4>
              <p className="text-sm text-green-600 mb-3">
                Use these exact category names in your CSV file:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-white px-3 py-1 rounded-md border flex items-center justify-between border-green-200 text-sm font-medium text-gray-800"
                  >
                    {category.name}
                    <button
                      onClick={() => copyCategoryText(category.name, index)}
                      className={`${
                        isCopy === index ? "text-green-500" : "text-stone-500"
                      } hover:scale-105`}
                    >
                      {" "}
                      {isCopy === index ? <FaCheck /> : <MdContentCopy />}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600 mt-2 italic">
                💡 Copy these names exactly as shown to avoid validation errors
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdDescription className="h-5 w-5 text-purple-900" />
            <div>
              <h4 className="font-semibold text-purple-900">
                Need a template?
              </h4>
              <p className="text-sm text-purple-900">
                Download sample CSV with your active categories, modify it and
                upload
              </p>
            </div>
          </div>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-950 transition-colors"
          >
            <MdDownload className="h-4 w-4" />
            Download Sample
          </button>
        </div>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : file
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          {file ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border">
                <MdDescription className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-800">{file.name}</span>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <MdClose className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-green-600 flex items-center gap-2">
                <MdCheckCircle className="h-4 w-4" />
                File uploaded successfully ({csvData.length} products found)
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-orange-50 rounded-full">
                <MdUpload className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800 mb-2">
                  Drop your CSV file here, or click to browse
                </p>
                <p className="text-sm text-orange-300">
                  Supports CSV files up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MdError className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Upload Error</h4>
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MdCheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {showPreview && csvData.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Preview Data
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
  <MdVisibility className="h-4 w-4" />
  Showing {Math.min(currentPage * itemsPerPage, csvData.length)} of {csvData.length} products (Page {currentPage} of {totalPages})
</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white">
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left font-semibold text-gray-700 border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((row, rowIndex) => (
                    <tr key={rowIndex} className="bg-white border-b">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-gray-800">
                          {cell.length > 30
                            ? `${cell.substring(0, 30)}...`
                            : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
         <div className="flex justify-center items-center gap-2 mt-4">

  {(currentPage > 1) && (
    <button
      className="h-12 w-12 rounded-full bg-[#f6e7d3] hover:bg-orange-400 hover:text-white text-purple-950 font-bold transition-colors flex items-center justify-center"
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      <FaArrowLeftLong />
    </button>
  )}
  

  { getPaginationButtons().map((pageNum) => (
    <button
      className={`${
        currentPage === pageNum
          ? "bg-orange-400 text-white"
          : "bg-[#f6e7d3]"
      } hover:bg-orange-400 hover:text-white h-12 w-12 rounded-full border-white text-purple-950 font-bold border-1 border-dashed text-lg transition-colors`}
      key={pageNum}
      onClick={() => setCurrentPage(pageNum)}
    >
      {pageNum}
    </button>
  ))}
  

  {(currentPage < totalPages) && (
    <button
      className="h-12 w-12 rounded-full bg-[#f6e7d3] hover:bg-orange-400 hover:text-white text-purple-950 font-bold transition-colors flex items-center justify-center"
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      <FaArrowRightLong/>
    </button>
  )}
</div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        {file && (
          <button
            onClick={removeFile}
            className="px-6 py-2.5 border border-red-300 bg-red-50/70 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
          >
            Clear File
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!file || isLoading || errors.length > 0}
          className=" px-7 py-2.5 bg-gradient-to-r from-purple-700 to-purple-800 text-white rounded-lg font-medium hover:from-purple-800 hover:to-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <MdRefresh className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <MdUpload className="h-5 w-5" />
              Upload Products
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddBulkProducts;

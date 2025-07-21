'use client';
import React, { useState, useEffect } from 'react';
import api from '../../user/common/api';


import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaStarOfLife } from "react-icons/fa";
import { CiCircleList } from "react-icons/ci";
import Link from 'next/link';


const AddProductForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    category: '',
    quantity: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState(null)
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories'); 
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...productImages];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setProductImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      productImages.forEach((file) => {
        formPayload.append('productImages', file);
      });

      const response = await api.post('/products', formPayload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
      setFormData({
        productName: '',
        price: '',
        category: '',
        quantity: '',
        description: '',
      });
      setProductImages([]);
      setImagePreviews([]);
      alert('Product added successfully!');
    } catch (error) {
      console.error(error);
      alert('Error adding product');
    }
    finally{
        setIsLoading(false)
    }
  };

  return (
    <div className="w-full p-12 bg-white rounded-xl shadow-[0_0_15px_#00000015] flex flex-col gap-10">
        <div className='flex items-center justify-between '>

      <h2 className="text-2xl font-semibold  text-gray-800">Add New Product</h2>
      <Link href={'/dashboard/products'} className="bg-purple-500  text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-purple-600 transition flex items-center gap-2" > <CiCircleList className='text-xl'/> Product List </Link>
        </div >
       
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">

          
          <div className='flex flex-col gap-2'>
            <label htmlFor="productName" className=" mb-1 text-sm font-medium text-gray-900 flex gap-1 ">
             <span className='text-red-500 text-[8px]'><FaStarOfLife /></span> Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder='Product Name'
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          
          <div className='flex flex-col gap-2'>
            <label htmlFor="price" className="flex gap-1 mb-1 text-sm font-medium text-gray-900">
              <span className='text-red-500 text-[8px]'><FaStarOfLife /></span> Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder='Product Price'
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          
          <div className='flex flex-col gap-2'>
            <label htmlFor="category" className="flex gap-1 mb-1 text-sm font-medium text-gray-900">
              <span className='text-red-500 text-[8px]'><FaStarOfLife /></span> Category
            </label>
            <select
              id="category"
              name="category"
              
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          
          <div className='flex flex-col gap-2'>
            <label htmlFor="quantity" className="flex gap-1 mb-1 text-sm font-medium text-gray-900">
             <span className='text-red-500 text-[8px]'><FaStarOfLife /></span> Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder='Quantity'
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          
          <div className="col-span-2 flex flex-col gap-2">
            <label htmlFor="description" className="flex gap-1 mb-1 text-sm font-medium text-gray-900">
              <span className='text-red-500 text-[8px]'><FaStarOfLife /></span> Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder='Enter product description here...'
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          
          <div className="col-span-2 flex flex-col gap-2">
            <label htmlFor="productImages" className="flex gap-1 mb-2 text-sm font-medium text-gray-900">
               <span className='text-red-500 text-[8px]'><FaStarOfLife /></span> Product Images
            </label>
            <input
              id="productImages"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
          </div>

         
          {imagePreviews.length > 0 && (
            <div className="col-span-2 grid grid-cols-3 gap-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-end'>
           <p className='text-red-500'>{errMessage}</p>
        </div>
        <div className="flex justify-end items-center gap-2">
          <button
            type="submit"
            className="bg-orange-400 text-white font-semibold py-2.5 px-8 rounded hover:bg-orange-500 transition flex items-center gap-2"
          >
           {isLoading ? "Uploading..." : "Upload"} <AiOutlineCloudUpload className='text-xl'/>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;

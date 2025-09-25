"use client";
import React, { useEffect, useState } from "react";
import AddCategoryForm from "../../../../../../components/admin/products/AddCategoryForm";
import api from "../../../../../../components/user/common/api";
import CategoryList from "../../../../../../components/admin/products/CategoryList";
import { toast } from "react-toastify";

const page = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [deleteCat, setDeleteCat] = useState({id:null, name:null})
  const [updatedCat, setUpdatedCat] = useState({id:null, name:null})
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug:"",
    description: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    name:"",
    slug: "",
    description:""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "slug"){
      const newValue = value.replace(" ", "_").toLowerCase();
      setFormData({ ...formData, [name]: newValue });
    }
    else{
      setFormData({ ...formData, [name]: value });
    }
      
  };


  const handleUpdatedChange = (e) => {
    const { name, value } = e.target;
    if(name === "slug"){
      const newValue = value.replace(" ", "_");
      setUpdateFormData({ ...updateFormData, [name]: newValue });
    }else{

      setUpdateFormData({ ...updateFormData, [name]: value });
    }

  };

  const handleDeleteCategory = (ids, name)=>{
        setShowDeletePopup(true);
        setDeleteCat({id:ids, name: name})

    }

  // get category data

  const getCategory = async()=>{
      try {
          const response = await api.get(`/product-categories`);
          if(response.status === 200){
            setCategoryData(response.data.data)
            
          }

      } catch (error) {
          console.error(error)
      }
  }

  useEffect(() => {
    getCategory()
  }, [])

  // handle delete

  const handleDelete = async()=>{
    setIsLoading(true)
    setErrMessage(null)
    try {
      if(!deleteCat.id) return setErrMessage("Category id not found")
      const response = await api.delete(`/product-categories/delete/${deleteCat.id}`)
      if(response.status === 200){
        toast.success(`${deleteCat.name} category deleted successfully`);
        getCategory();
        setErrMessage(false)
        setShowDeletePopup(false)
      }
    } catch (error) {
      console.error(error)
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
        setErrMessage(message)
    }
    finally{
      setIsLoading(false)
    }
  }

  // submit data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
    try {
      const response = await api.post(`/product-categories`, formData);
      if(response.status === 200){
        toast.success('Category created successfully');
        setFormData({
name: "",
    slug:"",
    description: "",
        })
        getCategory()
      }
    } catch (error) {
      console.error(error);
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
        setErrMessage(message)
    } finally {
      setIsLoading(false);
    }
  };

  // handle update

  const handleEdit = (id,name)=>{
    setShowEditPopup(true)
    setUpdatedCat({id,name})
    const editableData = categoryData.find(item=>item._id === id)
    setUpdateFormData(editableData)
  }

  const handleUpdateSubmit = async(e)=>{
     e.preventDefault();
    setIsLoading(true)
    setErrMessage(null)
    try {
      if(!updatedCat.id) return setErrMessage("Category id not found")
      const response = await api.put(`/product-categories/update/${updatedCat.id}`, updateFormData)
      if(response.status === 200){
        toast.success(`${updatedCat.name} category updated successfully`)
        setShowEditPopup(false)
        getCategory()
        setErrMessage(null)
      }
    } catch (error) {
      console.error(error)
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
        setErrMessage(message)
    }
    finally{
      setIsLoading(false)
    }
  }


  const handleToggleStatus = async(id)=>{
    try {
      const response = await api.patch(`/product-categories/status/${id}`)
      if(response.status === 200){
        toast.success('category status changed successfully')
        getCategory()
      }
    } catch (error) {
      console.error(error)
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
        setErrMessage(message)
    }
  }
  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <AddCategoryForm
          formData={formData}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          isLoading={isLoading}
          errMessage={errMessage}
        />
        <CategoryList categoryData={categoryData} showDeletePopup={showDeletePopup} setShowDeletePopup={setShowDeletePopup} isLoading={isLoading} errMessage={errMessage} handleDelete={handleDelete} handleDeleteCategory={handleDeleteCategory} deleteCat={deleteCat} showEditPopup={showEditPopup} setShowEditPopup={setShowEditPopup} updateFormData={updateFormData} setUpdateFormData={setUpdateFormData} handleUpdatedChange={handleUpdatedChange} handleUpdateSubmit={handleUpdateSubmit} handleEdit={handleEdit} handleToggleStatus={handleToggleStatus}/>
      </div>
    </>
  );
};

export default page;

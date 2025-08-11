"use client"
import React, {useState, useEffect} from 'react'
import CreateTestimonial from '../../../../../../components/admin/cms/testimonials/CreateTestimonial'
import api from '../../../../../../components/user/common/api';
import { toast } from 'react-toastify';
import ViewTestimonials from '../../../../../../components/admin/cms/testimonials/ViewTestimonials';


const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [testimonialData, setTestimonialData] = useState(null)
  const [deletedTestimonialId, setDeletedTestimonialId] = useState(null)
  const [updatedTestimonialId, setUpdatedTestimonialId] = useState(null)
  const [editPopupShow, setEditPopupShow] = useState(false)
  const [deletePopupShow, setDeletePopupShow] = useState(false)
  const [formData, setFormData] = useState({
        name:"",
        designation:"",
        message: ""
    })
  const [updateFormData, setUpdateFormData] = useState({
        name:"",
        designation:"",
        message: ""
    })

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
    const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const getTestimonialData = async()=>{
    try {
      const response = await api.get(`/testimonials`)
      if(response.status === 200){
        setTestimonialData(response.data.data)
        
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTestimonialData()
  }, [])
  

    const handleSubmit = async(e)=>{
       e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
      try {
        const response = await api.post(`/testimonials`, formData)
        if(response.status === 201 || response.status === 200){
          toast.success("testimonial created successfully")
          setFormData({
             name:"",
        designation:"",
        message: ""
          })
          getTestimonialData()
        }
      } catch (error) {
        console.log(error)
        const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      }
      finally{
        setIsLoading(false)
      }
    }

    const handleEdit = (id) => {
      setUpdatedTestimonialId(id)
      let data = testimonialData.find(item=>item._id === id)
      setUpdateFormData(data)
      setEditPopupShow(true)
    }

    const handleUpdateSubmit = async(e)=>{
       e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
      try {
        const response = await api.put(`/testimonials/${updatedTestimonialId}`, updateFormData)
        if(response.status === 201 || response.status === 200){
          toast.success("testimonial created successfully")
          setEditPopupShow(false)
          getTestimonialData()
        }
      } catch (error) {
        console.log(error)
        const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      }
      finally{
        setIsLoading(false)
      }
    }

   const handleSetDelete = (id)=>{
    setDeletedTestimonialId(id)
    setDeletePopupShow(true)
   }



    const handleDelete = async()=>{
      setIsLoading(true)
      try {
        if(!deletedTestimonialId) return setErrMessage("Testimonial id not found")
        const response = await api.delete(`/testimonials/${deletedTestimonialId}`)
        if(response.status === 200){
          toast.success('Testimonial deleted successfully')
          setDeletedTestimonialId(null)
    setDeletePopupShow(false)
    getTestimonialData()
        }
      } catch (error) {
        console.log(error)
        const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      }
      finally{
     setIsLoading(false)
      }
    }

    const handleToggleStatus = async(id, status) =>{
      try {
        if(!id) return toast.error("testimonial id not found")
        const response = await api.patch(`/testimonials/${id}/status`, {status})
        if(response.status === 200){
          toast.success(`status changed successfully to ${status === "active" ? "inactive": "active"}`)
          getTestimonialData()
        }
      } catch (error) {
        console.log(error)
        const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      }
    }

    


  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-8">
      <CreateTestimonial formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} handleChange={handleChange} isLoading={isLoading} errMessage={errMessage} />

      <ViewTestimonials testimonialData={testimonialData} handleDelete={handleDelete} isLoading={isLoading} errMessage={errMessage}
      deletePopupShow={deletePopupShow} setDeletePopupShow={setDeletePopupShow} handleSetDelete={handleSetDelete} editPopupShow={editPopupShow} setEditPopupShow={setEditPopupShow} handleUpdateSubmit={handleUpdateSubmit} updateFormData={updateFormData} handleUpdateChange={handleUpdateChange} handleEdit={handleEdit} handleToggleStatus={handleToggleStatus}/>
    </div>
  )
}

export default page

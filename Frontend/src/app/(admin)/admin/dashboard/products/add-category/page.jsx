"use client"
import React, {useEffect, useState} from 'react'
import AddCategoryForm from '../../../../../../../components/admin/products/AddCategoryForm'
import api from '../../../../../../../components/user/common/api'
import CategoryList from '../../../../../../../components/admin/products/CategoryList'

const page = () => {
    const [categoryData, setCategoryData] = useState(null)
    const [isLoading, setIsLoading]  = useState(false)
    const [errMessage, setErrMessage] = useState(null)
    const [formData, setFormData] = useState({
        categoryName: "",
        description:"",

    })

    const handleChange = (e)=>{
      const {name, value} = e.target;
      setFormData({...formData, [name]: value})
    }

    // get category data

    const getCategory = async()=>{
        try {
            const response = await api.get(``, {withCredentials: true});
            

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
      getCategory()
    }, [])

    // handle delete

   
    

    // submit data
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsLoading(true)
        try {
            const response = await api.post('')
        } catch (error) {
            console.error(error)
        }
        finally{
           setIsLoading(false)
        }

    }
  return (
    <>
      <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
        <AddCategoryForm formData={formData} handleSubmit={handleSubmit} handleChange={handleChange} isLoading={isLoading} errMessage={errMessage}/>
        <CategoryList categoryData={categoryData} />
      </div>
    </>
  )
}

export default page

"use client"

import { useParams } from 'next/navigation';
import React, {useState, useEffect} from 'react'
import api from '../../../../../../components/user/common/api';
import Profile from '../../../../../../components/admin/customers/Profile';
import PageLoader from '../../../../../../components/common/PageLoader';

const page = () => {
  const [userData, setUserData] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const {id} = useParams()

  const fetchUserData = async()=>{
    setIsLoading(true)
    setErrMessage(null)
    try {
      if(!id){ return setErrMessage("User id not found")}
      const response = await api.get(`/auth/user/${id}`)
      if(response.status === 200){
        setUserData(response.data.data)
      }
    } catch (error) {
      const message =
              (Array.isArray(error?.response?.data?.errors) &&
                error.response.data.errors[0]?.message) ||
              error?.response?.data?.message ||
              "Something went wrong";
            
            setErrMessage(message);
    } finally {
      setIsLoading(false)
    }
}

useEffect(() => {
      fetchUserData()
    }, [id])

    if(isLoading){
      return <PageLoader/>
    }

  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
      <Profile data={userData}/>
    </div>
  )
}

export default page

"use client"
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Inventory from '../../../../../../../components/admin/products/Inventory'
import api from '../../../../../../../components/user/common/api'
import PageLoader from '../../../../../../../components/common/PageLoader'

const page = () => {
    const [inventoryData, setInventoryData] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    
    const {id}= useParams()

    const fetchInventoryData = async()=>{
        setIsLoading(true)
        try {
            const response = await api.get(`products/${id}/inventory`)
            if(response.status === 200){
                setInventoryData(response.data.data)
                
            }
        } catch (error) {
            console.error(error)
        }
        finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
      fetchInventoryData()
    }, [])
    
    if(isLoading){
        return <PageLoader/>
    }

  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 min-h-screen flex flex-col gap-6">
      <Inventory inventoryData={inventoryData}/>
    </div>
  )
}

export default page

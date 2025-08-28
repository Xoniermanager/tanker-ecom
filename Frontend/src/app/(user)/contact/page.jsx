"use client"
import React, {useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import ContactComponent from '../../../../components/user/contact/ContactComponent'

import  {getPageData} from "../../../../components/admin/cms/common/getPageData"
import PageLoader from '../../../../components/common/PageLoader'
import FailedDataLoading from '../../../../components/common/FailedDataLoading'

const page = () => {
  const [contactData, setContactData] = useState(null)
   const [isLoading, setIsLoading] = useState(false)
    const fetchData = async()=>{
        setIsLoading(true)
        try{
         const pageData = await getPageData();
          setContactData(pageData?.data || null)
          
        }
        catch(error){
          console.error("error: ", error)
        }
        finally{
          setIsLoading(false)
        }
      }
    
      useEffect(() => {
        fetchData()
    
      }, []);

      if(isLoading){
    return (
    <PageLoader/>
    )
  }

  if(!contactData){
    return (
      <FailedDataLoading/>
    )
  }

      const addressData = contactData?.sections?.find(item=> item.section_id === "section-address")
      const contactsData = contactData?.sections?.find(item=> item.section_id === "section-contacts")
  return (
    <>
      <PageBanner  heading={'contact us'}/>
     {(addressData && contactsData ) && <ContactComponent addressData={addressData} contactsData={contactsData}/> }
    </>
  )
}

export default page

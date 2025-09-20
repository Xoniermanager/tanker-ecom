"use client"
import React, {useState, useEffect} from 'react';
import PageLoader from '../../../../../components/common/PageLoader';
import api from '../../../../../components/user/common/api';
import QuoteTable from '../../../../../components/admin/quote/QuoteTable';
import { toast } from 'react-toastify';
import Swal from "sweetalert2";


const page = () => {
    const [quoteData, setQuoteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false)
    const [errMessage, setErrMessage] = useState(null);
     const [currentPage, setCurrentPage] = useState(1);
           const [totalPages, setTotalPages] = useState(1);
            const [pageLimit, setPageLimit] = useState(10);


    const fetchQuote = async()=>{
        setIsLoading(true)
        try {
            const response = await api.get(`/contact?page=${currentPage}&limit=${pageLimit}`)
            if(response.status === 200){
                const data = response.data.data
                setQuoteData(data.data)
                setPageLimit(Number(data.limit))
                setTotalPages(Number(data.totalPages))
                setCurrentPage(Number(data.page))
                console.log("quoteData", response.data)
            }
        } catch (error) {
            const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
            if(process.env.NEXT_PUBLIC_NODE_ENV === "development"){
                console.error(message)
            }
        } finally{
            setIsLoading(false)
        }
    }



    useEffect(() => {
      fetchQuote();
    }, [pageLimit, currentPage])

    const handleDeleteQuote = async(id, name)=>{
      setLoading(true)

      const result = await Swal.fire({
        title: "Are you sure?",
          text: `You want to delete ${name} quote.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
      });


      try {
        if(result.isDismissed){
           return 
        }
        const response = await api.delete(`/contact/${id}`);
        if(response.status === 200){
          toast.success(`${name} quote deleted successfully`);
          fetchQuote()
        }
      } catch (error) {
        const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
        setErrMessage(message);
      } finally {
        setLoading(false)
      }
    }


    

    if(isLoading){
        return <PageLoader/>
    }
  return (
    <>
      <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
        <QuoteTable quoteData={quoteData} setTotalPages={setTotalPages} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} setPageLimit={setPageLimit} handleDeleteQuote={handleDeleteQuote}/>
      </div>
    </>
  )
}

export default page

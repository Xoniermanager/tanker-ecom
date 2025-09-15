"use client";
import React, { useState, useEffect } from "react";
import PageBar from "../../../../../components/admin/common/PageBar";
import CustomerGraphRow from "../../../../../components/admin/customers/CustomerGraphRow";
import CustomerTable from "../../../../../components/admin/customers/CustomerTable";
import api from "../../../../../components/user/common/api";
import PageLoader from "../../../../../components/common/PageLoader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const page = () => {
  const [usersData, setUsersData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [userName, setUserName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterByName, setFilterByName] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");


  const handleStatusFilter = (e)=>{
      setStatusFilter(e.target.value);
      setCurrentPage(1)
  }

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/auth/all-users?page=${currentPage}&limit=${pageLimit}${
          filterByName && `&fullName=${filterByName}`
        }${statusFilter && `&status=${statusFilter}`}`
      );
      if (response.status === 200) {
        setUsersData(response.data.data.data);
        setCurrentPage(Number(response.data.data.page));
        setTotalPages(Number(response.data.data.totalPages));
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      setErrMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageLimit, currentPage, filterByName, statusFilter]);

  useEffect(() => {
    const delayDebouncing = setTimeout(() => {
      setFilterByName(searchInput);
      setCurrentPage(1);
    }, 400);

    return () => {
      clearTimeout(delayDebouncing);
    };
  }, [searchInput]);


  const handleUserActivate = async(id, name)=>{
    setLoading(true)

    const result = await Swal.fire({
    title: "Are you sure?",
    text: `You want to activate ${name} account`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, activate it!",
    cancelButtonText: "Cancel",
  });

  

    try {
      if(result.isDismissed) {
        return
      }
      if(!id) return toast.error("User id not found")
      const response = await api.post(`/auth/activate/${id}`)
    if(response.status === 200){
      await fetchUsers()
      toast.success(`${response.data.message}`)
    }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      setErrMessage(message);
      toast.error(message)
    } finally{
      setLoading(false)
    }
  }
  const handleUserDeactivate = async(id, name)=>{
    setLoading(true)

    const result = await Swal.fire({
    title: "Are you sure?",
    text: `You want to deactivate ${name} account`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, deactivate it!",
    cancelButtonText: "Cancel",
  });

    try {
      if(result.isDismissed) {
        return
      }
      if(!id) return toast.error("User id not found")
      const response = await api.post(`/auth/deactivate/${id}`)
    if(response.status === 200){
      await fetchUsers()
      toast.success(`${response.data.message}`)
    }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      setErrMessage(message);
      toast.error(message)
    } finally{
      setLoading(false)
    }
  }

  

  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <PageBar heading={"Customers"} />
        {/* <CustomerGraphRow /> */}
        <CustomerTable
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          setPageLimit={setPageLimit}
          usersData={usersData}
          pageLimit={pageLimit}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          isLoading={isLoading}
          handleUserActivate={handleUserActivate}
          handleUserDeactivate={handleUserDeactivate}
          handleStatusFilter={handleStatusFilter}
        />
      </div>
    </>
  );
};

export default page;

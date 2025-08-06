"use client"
import Image from 'next/image'
import Link from 'next/link';
import React, {useState, useEffect} from 'react'
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import api from '../../../../components/user/common/api';
import { SiFusionauth } from "react-icons/si";


const Page = () => {
    const [isLoading, setIsLoading]  = useState(false)
    const [errMessage, setErrMessage] = useState(null)
    const [passShow, setPassShow] = useState(false)
    const [formData, setFormData] = useState({
        companyEmail:"",
        password:""
    })

    const router = useRouter();

     const handleChange = (e)=>{
     const {name, value} = e.target
     setFormData({...formData, [name]: value})
  }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setIsLoading(true)
        setErrMessage("")
        try {
            const response = await api.post(`/auth/request-admin-login-otp`, {email: formData.companyEmail, password: formData.password})
            if(response.status === 200){
                toast.success("Credentials accepted, please verify otp")
                window.localStorage.setItem('verify-login-email', formData.companyEmail)
                window.localStorage.setItem('verify-login-password', formData.password)
                setFormData({companyEmail: "", password: ""})
                setErrMessage("")
                router.push("/verify-otp")
            }

        } catch (error) {
            console.error(error)
             const message = (Array.isArray(error?.response?.data?.errors) && error.response.data.errors[0]?.message) ||
  error?.response?.data?.message ||  "Something went wrong";
  setErrMessage(message)
        }
        finally{
            setIsLoading(false)
        }
    }
  return (
    <>
      <div className='bg-slate-100  '>
        <div className='max-w-7xl mx-auto flex items-center gap-8 my-auto h-screen'>
             <div className='w-[42%] flex flex-col gap-2'>
                      <h1 className='text-[40px] font-bold text-purple-950 '>Welcome Admin</h1>
                      <p className='text-zinc-500 text-lg font-medium'>Login to access your dashboard and manage your company profile.</p>
                      <Image src={'/images/login.webp'} width={420} height={420} alt='signup image'/>
                      <div className='flex items-center gap-4'>
                      <button style={{borderRadius: "8px"}} onClick={()=>router.back()} className='btn-one'> Step Back</button>
                      <Link href={'/'} style={{borderRadius: "8px"}} className='btn-two' >Back to home</Link>
                      </div>
                    </div>
                    <div className='w-[57%] bg-white rounded-lg shadow-[0_0_14px_#00000015] p-9 flex flex-col gap-6'>
                        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                            <div className='w-full flex flex-col gap-3'>
                                <label htmlFor="companyEmail" className='text-purple-950 flex gap-1.5 items-center font-medium'> < FaEnvelope/> Company Email</label>
                                <input type="text" name='companyEmail' value={formData.companyEmail} className='border-1 border-neutral-200 rounded py-3.5 px-5 outline-none' onChange={handleChange} placeholder='Enter Company Email' />
                            </div>
                            <div className='w-full flex flex-col gap-3'>
                                <label htmlFor="password" className='text-purple-950 flex gap-1.5 items-center font-medium'> < RiLockPasswordFill className='text-xl'/> Password</label>
                                <div className='border-1 border-neutral-200 rounded py-3.5 px-5 outline-none flex items-center'>
                                              {passShow ? <input type='text' name='password' className='w-full outline-none' placeholder='Enter Password' value={formData.password} onChange={handleChange}/> : <input type='password' name='password' className='w-full outline-none' placeholder='Enter Password' value={formData.password} onChange={handleChange}/>} {passShow ? <span className='text-lg hover:text-purple-950 hover:cursor-pointer hover:scale-105 ' onClick={()=>setPassShow(false)}> <FaEye/></span> :  <span className='text-lg hover:text-purple-950 hover:cursor-pointer hover:scale-105 ' onClick={()=>setPassShow(true)}> <FaEyeSlash/></span>} </div>
                            </div>
                            <div className="flex justify-end">
                                <Link href={'admin/reset-password'} className='text-orange-500 hover:underline font-medium'> Forgot your password?</Link>
                            </div>
                            {errMessage && <div className="flex justify-end">
                                <p className='text-red-500'>{errMessage}</p>
                            </div>}
                            <div className='flex items-center justify-start'>
                                <button type="submit" disabled={formData.companyEmail === "" || formData.password.length < 8 || isLoading} className='px-10 group py-2.5 flex items-center gap-2.5 bg-purple-900 hover:bg-purple-950 disabled:bg-purple-300 text-white font-medium uppercase rounded-md'>
                                 {isLoading ? "Submitting..." :  "Login"} <SiFusionauth className='group-hover:rotate-90 text-md'/>
                            </button>
                            </div>
                            {/* <div className="flex">
                                <p className='text-zinc-500 text-lg font-medium'> Don't have an account? please <Link href={'/signup'} className='text-orange-500 font-medium underline'>  Sign Up </Link></p>
                            </div> */}
                            
                        </form>
                    </div>
        </div>

      </div>
    </>
  )
}

export default Page

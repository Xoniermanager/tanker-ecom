"use client"
import Image from 'next/image'
import Link from 'next/link';
import React, {useState, useEffect} from 'react'
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const LoginForm = () => {
    const [isLoading, setIsLoading]  = useState(false)
    const [errMessage, setErrMessage] = useState(null)
    const [passShow, setPassShow] = useState(false)
    const [formData, setFormData] = useState({
        companyEmail:"",
        password:""
    })

     const handleChange = (e)=>{
     const {name, value} = e.target
     setFormData({...formData, [name]: value})
  }

    const handleSubmit = (e)=>{
        e.preventDefault()
        setIsLoading(true)
        try {
            
        } catch (error) {
            console.error(error)
        }
        finally{
            setIsLoading(false)
        }
    }
  return (
    <>
      <div className='bg-slate-100 py-24'>
        <div className='max-w-7xl mx-auto flex items-start gap-8'>
             <div className='w-[42%] flex flex-col gap-2'>
                      <h1 className='text-[40px] font-bold text-purple-950 '>Welcome Back</h1>
                      <p className='text-zinc-500 text-lg font-medium'>Login to access your dashboard and manage your company profile.</p>
                      <Image src={'/images/login.webp'} width={460} height={460} alt='signup image'/>
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
                                              {passShow ? <input type='text' name='number' className='w-full outline-none' placeholder='Enter Password' value={formData.number} onChange={handleChange}/> : <input type='password' name='number' className='w-full outline-none' placeholder='Enter Password' value={formData.number} onChange={handleChange}/>} {passShow ? <span className='text-lg hover:text-purple-950 hover:cursor-pointer hover:scale-105 ' onClick={()=>setPassShow(false)}> <FaEye/></span> :  <span className='text-lg hover:text-purple-950 hover:cursor-pointer hover:scale-105 ' onClick={()=>setPassShow(true)}> <FaEyeSlash/></span>} </div>
                            </div>
                            <div className="flex justify-end">
                                <Link href={''} className='text-orange-500 hover:underline font-medium'> Forgot your password?</Link>
                            </div>
                            {errMessage && <div className="flex justify-end">
                                <p className='text-red-500'>{errMessage}</p>
                            </div>}
                            <div className='flex'>
                                <button style={{borderRadius: "8px"}} type="submit" className='btn-two uppercase'>
                                 Login
                            </button>
                            </div>
                            <div className="flex">
                                <p className='text-zinc-500 text-lg font-medium'> Don't have an account? please <Link href={'/signup'} className='text-orange-500 font-medium underline'> Sign Up </Link></p>
                            </div>
                            
                        </form>
                    </div>
        </div>

      </div>
    </>
  )
}

export default LoginForm

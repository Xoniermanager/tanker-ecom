import Image from 'next/image'
import React from 'react'

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen fixed top-0 right-0 left-0 bottom-0 w-full h-full z-1002 bg-white">
      <div className="flex flex-col items-center space-y-4">
        <Image src={'/images/tire.png'} height={200} width={200} alt='tire' className='animate-spin w-22 h-22 object-contain'/>
       
        <h1 className="text-xl font-semibold text-orange-500">Loading...</h1>
      </div>
    </div>
  )
}

export default PageLoader

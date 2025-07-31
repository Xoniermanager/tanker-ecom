import Image from 'next/image'
import React from 'react'

const WatchImage = ({imgUrl, setPrevUrl}) => {
  return (
    <>
    <div className='fixed top-0 left-0 right-0 bottom-0 z-149 backdrop-blur-sm bg-black/10' onClick={()=>setPrevUrl(null)}></div>
    <Image src={imgUrl} height={40} width={40} className='fixed top-1/2 z-151 bg-white rounded-lg left-1/2 -translate-1/2 w-[550px] object-cover shadow-xl' alt='image'/>
      </>
    
  )
}

export default WatchImage

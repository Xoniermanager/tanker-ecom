import Link from 'next/link'
import React from 'react'

const FooterStripe = () => {
  return (
    <>
      <div style={{backgroundImage: "url('/images/stripe-bg.jpg')"}} className="w-full py-20 relative strip bg-no-repeat bg-cover">
      <div className='flex items-center gap-10 max-w-full px-4 mx-auto relative z-10 pl-88'>

        <h2 className='text-white text-5xl font-black w-2/3 leading-14 '>We ensure safe transportation & delivery</h2>
        <div className="w-1/3 flex justify-end">
        <Link href={"/contact"} className='btn-two-big'> Contact Us </Link></div>
      </div>
      </div>
    </>
  )
}

export default FooterStripe

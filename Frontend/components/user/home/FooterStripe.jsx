import Link from 'next/link'
import React from 'react'

const FooterStripe = () => {
  return (
    <>
      <div style={{backgroundImage: "url('/images/stripe-bg.jpg')"}} className="w-full py-20 relative strip">
      <div className='flex items-center gap-10 max-w-5xl mx-auto relative z-10 pl-24'>

        <h2 className='text-white text-5xl font-black w-2/3 leading-14'>We ensure safe transportation & delivery</h2>
        <Link href={"/contact"} className='px-10 py-4 bg-black text-white text-lg font-semibold tracking-wide'> Contact Us </Link>
      </div>
      </div>
    </>
  )
}

export default FooterStripe

'use client'

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const CountryMonitor = () => {
  const countries = [
    {
      name: "United States",
      flag: "/images/usa.svg", 
      sales: "$12,400"
    },
    {
      name: "India",
      flag: "/images/usa.svg",
      sales: "$9,870"
    },
    {
      name: "Germany",
      flag: "/images/usa.svg",
      sales: "$7,540"
    },
    {
      name: "Canada",
      flag: "/images/usa.svg",
      sales: "$6,300"
    },
  ]

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className="w-full flex items-center justify-between gap-4">
        <h3 className='text-2xl font-medium'>Your Top Countries</h3>
        <Link href={``} className='text-orange-600 hover:underline'>View All</Link>
      </div>

      <div className='w-full rounded-xl p-4 bg-white'>
        <table className='w-full text-left'>
          <tbody>
            {countries.map((country, index) => (
              <tr key={index} className='border-b border-gray-200 last:border-none'>
                <td className='py-3'>
                  <div className='flex items-center gap-3'>
                    <Image 
                      src={country.flag} 
                      alt={country.name} 
                      width={38} 
                      height={38} 
                      className='rounded-full object-cover' 
                    />
                    <span className=' text-gray-800'>{country.name}</span>
                  </div>
                </td>
                <td className='py-3 text-right  '>
                  {country.sales}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CountryMonitor

'use client'
import React from 'react'
import Slider from "react-slick"
import Image from 'next/image'
import Link from 'next/link'
import { RiStarSFill } from "react-icons/ri"

const ReviewsBox = () => {
  const data = [
    {
      name: "Mridul Sakalni",
      para: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, animi aspernatur. Enim repellendus error fuga est eum recusandae facilis facere vel. Eos, explicabo.",
      rating: 5,
      image: "/images/employee_two.jpg"
    },
    {
      name: "Darpan Sharma",
      para: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, animi aspernatur. Enim repellendus error fuga est eum recusandae facilis facere vel. Eos, explicabo.",
      rating: 4,
      image: "/images/employee_two.jpg"
    },
    {
      name: "Vishnu",
      para: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, animi aspernatur. Enim repellendus error fuga est eum recusandae facilis facere vel. Eos, explicabo.",
      rating: 5,
      image: "/images/employee_two.jpg"
    },
  ]

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  }

  return (
    <div className="bg-white shadow-[0_0_15px_#00000015] p-6 rounded-xl flex flex-col gap-4.5 hover:scale-[1.04] hover:shadow-[0_0_18px_#00000018] transition-all duration-300">
      <div className="flex items-center gap-4 justify-between">
        <h3 className='text-2xl font-medium'>Recent Reviews</h3>
        <Link href={'/reviews'} className='text-orange-500 hover:underline text-sm'>View All</Link>
      </div>

      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className="p-2 flex flex-col gap-2">
            <div className="flex gap-4 items-start w-fill">
              <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-full h-14 w-14 object-cover" />
              <div className="flex flex-col gap-1">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                
                <div className="flex gap-1 text-yellow-500 text-xl">
                  {[...Array(item.rating)].map((_, i) => (
                    <RiStarSFill key={i} />
                  ))}
                </div>
              </div>
            </div>
            <p className="line-clamp-2 text-[15px] w-full pt-4">{item.para}</p>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ReviewsBox

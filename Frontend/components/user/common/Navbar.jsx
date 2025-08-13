'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaFacebookF } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { usePathname } from 'next/navigation';

const Navbar = ({siteData}) => {
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className='w-full bg-white shadow-[5px_0_20px_#00000025] flex flex-col'>
        
        {/* Top Purple Bar */}
        <div className="bg-purple-950 py-2.5 w-full">
          <div className='max-w-full px-4 mx-auto flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              {siteData?.contactDetails?.socialMediaLinks?.facebook && <Link href={siteData?.contactDetails?.socialMediaLinks?.facebook} className='text-white'> <FaFacebookF /> </Link>}
              <span className='h-[20px] border-r-1 border-white'></span>
              <Image
                src={'/images/box.png'}
                width={20}
                height={20}
                alt='box'
              />
              <span className='text-white'>{siteData?.siteDetails?.slogan}</span>
            </div>
            <Link href={`tel:${siteData?.contactDetails?.phoneNumbers?.contact_one}`} className='flex items-center gap-4 group'>
              <span className='h-11 w-11 bg-black rounded-full text-white flex items-center justify-center text-2xl'>
                <FiPhoneCall />
              </span>
              <div className='flex flex-col gap-0'>
                <h4 className='uppercase font-semibold text-white'>support</h4>
                <p className='group-hover:text-orange-400 text-white'>{siteData?.contactDetails?.phoneNumbers?.contact_one}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Sticky Navbar */}
        <div
          className={`max-w-full px-4 py-3 flex items-center bg-white mid-nav transition-all duration-300 ${
            isSticky
              ? 'fixed top-0 left-0 w-full z-[500] shadow-lg animate-slideDown'
              : 'relative'
          }`}
        >
          {/* Logo */}
          <div className="w-[20%]">
            <Link href={'/'}>
              <Image
                src={'/images/tanker-solution-logo.png'}
                width={190}
                height={120}
                alt='logo'
              />
            </Link>
          </div>

          {/* Nav Links */}
          <div className="w-[45%]">
            <nav>
              <ul className="flex items-start justify-start gap-6">
                <li>
                  <Link href={'/'} className={`${pathname === "/" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={'/about'} className={`${pathname === "/about" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={'/products'} className={`${pathname === "/products" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                    Product
                  </Link>
                </li>
                <li>
                  <Link href={'/news'} className={`${pathname === "/news" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                    News Feed
                  </Link>
                </li>
                <li>
                  <Link href={'/gallery'} className={`${pathname === "/gallery" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href={'/contact'} className={`${pathname === "/contact" && "text-orange-400"} text-neutral-900 text-lg hover:text-orange-400`}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Buttons */}
          <div className="w-[35%] flex items-center justify-end gap-5">
            <Link href={'/login'} className='btn-one font-semibold'>
              B2B Login
            </Link>
            <Link href={'/signup'} className='btn-two font-semibold'>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

"use client";
import React, { useState, useEffect } from "react";
import Banner from "../../../../../../components/admin/cms/home/Banner";
import OurServices from "../../../../../../components/admin/cms/home/OurServices";
import AboutUs from "../../../../../../components/admin/cms/home/AboutUs";
import Products from "../../../../../../components/admin/cms/home/Products";
import Counter from "../../../../../../components/admin/cms/common/Counter";
import Article from "../../../../../../components/admin/cms/home/Article";
import api from "../../../../../../components/user/common/api";

const page = () => {
  const [active, setActive] = useState(1);
  const [homePageData, setHomeData] = useState(
    
{
  "seo": {
    "metaTitle": "...",
    "metaDescription": "...",
    "ogImage": "..."
  },
  "sections": [
    {
      "order": 1,
      "section_id": "section-banner",
      "heading": "Banner",
      "subheading": "N/A",
      "thumbnail": {
        "type": "video",
        "source": "https://example.com/video.mp4"
      },
      "contents": [
        {
          "order": 1,
          "type": "text",
          "label": "Tagline",
          "text": "We Offer Global Solutions."
        },
        {
          "order": 2,
          "type": "text",
          "label": "Headline",
          "text": "Welcome to Tanker Solutions"
        },
        {
          "order": 3,
          "type": "text",
          "label": "Description",
          "text": "Tanker Solutions is dedicated to providing the best quality cost effective solution to your fuel and dry bulk transport and delivery needs."
        },
        {
          "type": "link",
          "label": "Call To Action",
          "text": "Contact Us",
          "link": "/contact"
        }
      ]
    },
    {
      "order": 2,
      "section_id": "section-our-services",
      "heading": "Our Services",
      "subheading": "WHAT WE OFFER",
      "contents": [
        {
          "order": 1,
          "type": "text",
          "label": "Description",
          "text": "Tanker Solutions provides a comprehensive range of services for tanker fleet owners and operators:"
        },
        {
          "order": 2,
          "type": "cards",
          "contents": [
            {
              "order": 1,
              "type": "card",
              "label": "Service #1",
              "title": "Specialist Welding and Vehicle Fabrication",
              "description": "Including new chassis building, chassis extensions, 5th wheel installations and tank remounts - all to the highest industry standards."
            },
            {
              "order": 2,
              "type": "card",
              "label": "Service #2",
              "title": "Final assembly and certification",
              "description": " We make sure everything on your vehicle is ready to start delivering fuel, including all necessary certification. We'll even make your driver a cup of tea to send him on his way."
            },
            {
              "order": 3,
              "type": "card",
              "label": "Service #3",
              "title": "Aluminum and Brass Casting",
              "description": " Our sister company, Neales Foundry (2016) Limited, can cast and manufacture most things in aluminium or bronze. Please call Daniel on 021 262 8784 for further information."
            },
            {
              "order": 4,
              "type": "card",
              "label": "Service #4",
              "title": "Specialist Fuel System Design",
              "description": " With our years of industry experience there is no fuel transport and handling problem that we cannot design a solution for. We have in the past developed innovative fuel handling solutions for demanding military and aviation clients. Independent registered engineers validate our designs to the required standards where required."
            },
            {
              "order": 5,
              "type": "card",
              "label": "Service #5",
              "title": "Testing and inspection",
              "description": " With our years of industry experience there is no fuel transport and handling problem that we cannot design a solution for. We have in the past developed innovative fuel handling solutions for demanding military and aviation clients. Independent registered engineers validate our designs to the required standards where required."
            }
          ]
        }
      ]
    },
    {
      "order": 3,
      "section_id": "section-about-company",
      "heading": "About Us",
      "subheading": "About Company",
      "thumbnail": {
        "type": "video",
        "source": "https://example.com/video.mp4"
      },
      "contents": [
        {
          "order": 1,
          "type": "text",
          "label": "Description",
          "text": "Tanker Solutions Ltd is New Zealand's leading supplier of tankers and tank trailers to the New Zealand petroleum industry. We can supply anything from a dustcap to a complete turnkey new built tanker and trailer ready to take to the road, fully certified to deliver fuel."
        },
        {
          "order": 2,
          "type": "list",
          "contents": [
            {
              "order": 1,
              "type": "text",
              "label": "Highlight #1",
              "text": "We also have the expertise and equipment to undertake a wide range of light engineering with access to independent certifying engineers where required."
            },
            {
              "order": 2,
              "type": "text",
              "label": "Highlight #2",
              "text": "Tanker solutions was founded in April 2007 by Mark and Robyn Wilkin when they recognised the need for an independent customer focused tankwagon constructor based in Wellington."
            },
            {
              "order": 3,
              "type": "text",
              "label": "Highlight #3",
              "text": "At Tanker Solutions we are proud of our friendly and efficient customer service, quality products, competitive pricing and speedy delivery."
            }
          ]
        },
        {
          "order": 3,
          "type": "group",
          "contents": [
            {
              "type": "phone",
              "label": "Contact Number",
              "text": "Have Question",
              "phone_number": "+64 4 237 4555"
            },
            {
              "type": "link",
              "label": "Button",
              "text": "Read More",
              "link": "/about"
            }
          ]
        },
        {
          "order": 4,
          "type": "text",
          "label": "Description",
          "text": "The Tanker Solutions team has collectively amassed over 100 years experience in servicing the New Zealand petroleum industry and has fully embraced modern technology and has the strategic backing of leading international suppliers of petroleum equipment."
        }
      ]
    },
    {
      "order": 4,
      "section_id": "section-our-products",
      "heading": "Our Products",
      "subheading": "WHAT WE OFFER",
      "contents": [
        {
          "order": 1,
          "type": "reference_content",
          "label": "Source of Data",
          "ref": "/products",
          "limit": 10
        }
      ]
    },
    {
      "order": 5,
      "section_id": "section-track-record",
      "heading": "Track Record",
      "subheading": "N/A",
      "contents": [
        {
          "order": 1,
          "type": "group",
          "label": "Highlight #1",
          "contents": [
            {
              "order": 1,
              "type": "text",
              "label": "Number",
              "text": "99%+"
            },
            {
              "order": 2,
              "type": "text",
              "label": "Text",
              "text": "Delivery on time"
            }
          ]
        },
        {
          "order": 2,
          "type": "group",
          "label": "Highlight #2",
          "contents": [
            {
              "order": 1,
              "type": "text",
              "label": "Number",
              "text": "500+"
            },
            {
              "order": 2,
              "type": "text",
              "label": "Text",
              "text": "Custom Tankers Delivered"
            }
          ]
        },
        {
          "order": 3,
          "type": "group",
          "label": "Highlight #3",
          "contents": [
            {
              "order": 1,
              "type": "text",
              "label": "Number",
              "text": "200+"
            },
            {
              "order": 2,
              "type": "text",
              "label": "Text",
              "text": "Years of Combined Industry Experience"
            }
          ]
        },
        {
          "order": 4,
          "type": "group",
          "contents": [
            {
              "order": 1,
              "type": "text",
              "label": "Number",
              "text": "3+"
            },
            {
              "order": 2,
              "type": "text",
              "label": "Text",
              "text": "Fully Equipped Facilities"
            }
          ]
        }
      ]
    },
    {
      "order": 6,
      "section_id": "section-6",
      "heading": "Our Articles",
      "subheading": "Our Latest Articles Post From Blog",
      "contents": [
        {
          "order": 1,
          "type": "reference_content",
          "label": "Source of Data",
          "ref": "/articles",
          "limit": 4
        }
      ]
    }
  ]
}







);

 

  const handleActive = (e) => {
    setActive(e);
  };

  const getHomePageData = async () => {
    try {
    //   const response = await api.get(`/api/`);
    } catch (error) {
      console.error(error);
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      
    }
  };

  useEffect(() => {
    getHomePageData();
  }, []);

  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <ul className="p-4 bg-white rounded-xl flex items-center justify-start gap-4 shadow-[0_0_15px_#00000020]">
          <li>
            <button
              className={`${
                active === 1 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(1)}
            >
              Banner
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 2 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(2)}
            >
              Our Services
            </button>
          </li>
          <li>
            <button
              className={` ${
                active === 3 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2 rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(3)}
            >
              About Us
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 4 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2 rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(4)}
            >
              Our Products
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 5 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(5)}
            >
              Counter
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 6 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2 rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(6)}
            >
              Our Article
            </button>
          </li>
        </ul>
        <div className="">
        

            
            <>
          {active === 1 && <Banner homeData={homePageData.sections.find(item=>item?.order === 1)}/>}
          {active === 2 && (
    <OurServices serviceData={homePageData?.sections.find(item => item?.order === 2)} />
  )}
          {active === 3 && <AboutUs aboutData={homePageData?.sections.find(item=>item?.order === 3)}/>}
          {active === 4 && <Products />}
          {active === 5 && <Counter />}
          {active === 6 && <Article />}
          </>
            
        </div>
      </div>
    </>
  );
};

export default page;

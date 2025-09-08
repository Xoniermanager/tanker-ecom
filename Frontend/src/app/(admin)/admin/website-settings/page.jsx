"use client";
import React, { useEffect, useState } from "react";
import UpdateWebsiteComponent from "../../../../../components/admin/website-setting/UpdateWebsiteComponent";
import api from "../../../../../components/user/common/api";
import { toast } from "react-toastify";
import PageLoader from "../../../../../components/common/PageLoader";
import UploadingLogo from "../../../../../components/admin/website-setting/UploadingLogo";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [websiteSettingData, setWebsiteSettingData] = useState(null)

  const [formData, setFormData] = useState({
    contactDetails: {
      emails: {
        // sales_enquiry: "",
        // bdm: "",
        footer: "",
      },
      phoneNumbers: {
        // service_depot: "",
        contact_one: "",
        contact_two: "",
      },
      addresses: {
        head_office: "",
        address_link: "",
        service_depot: "",
      },
      socialMediaLinks: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        youtube: "",
      },
    },
    siteDetails: {
      logo: { url: "", key: "" },
      title: "",
      slogan: "",
      description: "",
      copyright: "",
    },
    seoDetails: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      canonicalUrl: "",
    },
  });

  
  const handleChange = (e, path) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };



   const getWebsiteSettingData = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/site-settings`);
      if (response.status === 200) {
        const data = response.data.data;

       
        setFormData((prev) => ({
          ...prev,
          contactDetails: {
            emails: {
            //   sales_enquiry: data.contactDetails.emails.sales_enquiry || "",
            //   bdm: data.contactDetails.emails.bdm || "",
              footer: data.contactDetails.emails.footer || "",
            },
            phoneNumbers: {
            //   service_depot: data.contactDetails.phoneNumbers.service_depot || "",
              contact_one: data.contactDetails.phoneNumbers.contact_one || "",
              contact_two: data.contactDetails.phoneNumbers.contact_two || "",
            },
            addresses: {
              head_office: data.contactDetails.addresses.head_office || "",
              address_link: data.contactDetails.addresses.address_link || "",
              service_depot: data.contactDetails.addresses.service_depot || "",
            },
            socialMediaLinks: {
              facebook: data.contactDetails.socialMediaLinks.facebook || "",
              twitter: data.contactDetails.socialMediaLinks.twitter || "",
              linkedin: data.contactDetails.socialMediaLinks.linkedin || "",
              instagram: data.contactDetails.socialMediaLinks.instagram || "",
              youtube: data.contactDetails.socialMediaLinks.youtube || "",
            },
          },
          siteDetails: {
            logo: data.siteDetails.logo || { url: "", key: "" },
            title: data.siteDetails.title || "",
            slogan: data.siteDetails.slogan || "",
            description: data.siteDetails.description || "",
            copyright: data.siteDetails.copyright || "",
          },
          seoDetails: {
            metaTitle: data.seoDetails.metaTitle || "",
            metaDescription: data.seoDetails.metaDescription || "",
            keywords:
              Array.isArray(data.seoDetails.keywords)
                ? data.seoDetails.keywords.join(", ")
                : data.seoDetails.keywords || "",
            canonicalUrl: data.seoDetails.canonicalUrl || "",
          },
        }));

        setWebsiteSettingData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };


  useEffect(() => {
   getWebsiteSettingData();
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
    try {
        
       const keyArr = formData.seoDetails.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k); 

    const newFormData = new FormData()
    console.log("logo file: ", formData.siteDetails.logo.file)
    if(formData.siteDetails.logo.file){
      newFormData.append("logo", formData.siteDetails.logo.file)
    }

    const payload = {
      ...formData,
      ...newFormData,
      seoDetails: {
        ...formData.seoDetails,
        keywords: keyArr, 
      },
    };
      
      const response = await api.put(`/site-settings`, payload)
      if(response.status === 200){
        toast.success(`Site setting updated successfully`)
      }
    } catch (error) {
       const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      
    }
    finally{
        setIsLoading(false)
    }
  };

  if(isLoading){
    return <PageLoader />
  }

  return (
    <div className="pl-86 pt-26 p-6 w-full min-h-screen bg-violet-50 flex flex-col items-start gap-6">
      <UploadingLogo />
      <UpdateWebsiteComponent
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        isLoading={isLoading}
        errMessage={errMessage}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Page;

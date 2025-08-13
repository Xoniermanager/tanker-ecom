import React, { useRef } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

const UpdateWebsiteComponent = ({
  handleSubmit,
  handleChange,
  formData,
  isLoading,
  errMessage,
  setFormData, 
}) => {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        siteDetails: {
          ...prev.siteDetails,
          logo: {
            url: previewUrl,
            key: file.name, 
            file, 
          },
        },
      }));
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      siteDetails: { ...prev.siteDetails, logo: { url: "", key: "", file: null } },
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl">
      <h1 className="font-semibold text-2xl text-purple-950 flex items-center gap-2 mb-7">
        <span className="text-orange-500">
          <IoSettingsOutline />
        </span>
        Handle Website Settings
      </h1>

      

      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        
        <SectionTitle title="Email Management" />
        <GridTwo>
          {[
            // ["Sales Enquiry Email", "contactDetails.emails.sales_enquiry", "email"],
            // ["BDM Email", "contactDetails.emails.bdm", "email"],
            ["Footer Email", "contactDetails.emails.footer", "email"],
          ].map(([label, path, type], i) => (
            <InputField
              key={i}
              label={label}
              type={type}
              value={getValue(formData, path)}
              onChange={(e) => handleChange(e, path)}
              required
            />
          ))}
        </GridTwo>

       
        <SectionTitle title="Contact Number Management" />
        <GridTwo>
          {[
            // ["Service Depot", "contactDetails.phoneNumbers.service_depot", "tel"],
            ["Contact One", "contactDetails.phoneNumbers.contact_one", "tel"],
            ["Contact Two", "contactDetails.phoneNumbers.contact_two", "tel"],
          ].map(([label, path, type], i) => (
            <InputField
              key={i}
              label={label}
              type={type}
              value={getValue(formData, path)}
              onChange={(e) => handleChange(e, path)}
            />
          ))}
        </GridTwo>

       
        <SectionTitle title="Address Management" />
        <GridTwo>
          {[
            ["Head Office", "contactDetails.addresses.head_office", "text"],
            ["Address Link", "contactDetails.addresses.address_link", "url"],
            ["Service Depot", "contactDetails.addresses.service_depot", "text"],
          ].map(([label, path, type], i) => (
            <InputField
              key={i}
              label={label}
              type={type}
              value={getValue(formData, path)}
              onChange={(e) => handleChange(e, path)}
            />
          ))}
        </GridTwo>

        
        <SectionTitle title="Social Media Links" />
        <GridTwo>
          {[
            ["Facebook", "contactDetails.socialMediaLinks.facebook", "url", "Enter Your FaceBook Link"],
            ["Twitter", "contactDetails.socialMediaLinks.twitter", "url", "Enter Your Twitter Link"],  
            ["LinkedIn", "contactDetails.socialMediaLinks.linkedin", "url",  "Enter Your LinkedIn Link"],
            ["Instagram", "contactDetails.socialMediaLinks.instagram", "url",  "Enter Your Instagram Link"],
            ["YouTube", "contactDetails.socialMediaLinks.youtube", "url", "Enter Your YouTube Link"]
          ].map(([label, path, type, placeholder], i) => (
            <InputField
              key={i}
              label={label}
              type={type}
              value={getValue(formData, path)}
              onChange={(e) => handleChange(e, path)}
              placeholder={placeholder}
            />
          ))}
        </GridTwo>

        
        <SectionTitle title="Site Details" />
        <div className="p-4 bg-purple-50/50 rounded-lg flex flex-col gap-4">
          
          <div>
            <label className="block mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {formData.siteDetails.logo.url ? (
                <div className="relative w-20 h-20">
                  <img
                    src={formData.siteDetails.logo.url}
                    alt="Logo Preview"
                    className="w-20 h-20 object-contain rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 border border-neutral-300 rounded-lg bg-white hover:bg-purple-50 transition"
                >
                  Upload Logo
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          </div>

          <InputField
            label="Site Title"
            value={formData.siteDetails.title}
            onChange={(e) => handleChange(e, "siteDetails.title")}
          />
          <InputField
            label="Slogan"
            value={formData.siteDetails.slogan}
            onChange={(e) => handleChange(e, "siteDetails.slogan")}
          />
          <TextareaField
            label="Description"
            value={formData.siteDetails.description}
            onChange={(e) => handleChange(e, "siteDetails.description")}
          />
          <InputField
            label="Copyright"
            value={formData.siteDetails.copyright}
            onChange={(e) => handleChange(e, "siteDetails.copyright")}
          />
        </div>

        
        <SectionTitle title="SEO Details" />
        <div className="p-4 bg-purple-50/50 rounded-lg flex flex-col gap-4">
          <InputField
            label="Meta Title"
            value={formData.seoDetails.metaTitle}
            onChange={(e) => handleChange(e, "seoDetails.metaTitle")}
          />
          <TextareaField
            label="Meta Description"
            value={formData.seoDetails.metaDescription}
            onChange={(e) => handleChange(e, "seoDetails.metaDescription")}
          />
          <InputField
            label="Keywords (comma separated)"
            value={formData.seoDetails.keywords}
            onChange={(e) => handleChange(e, "seoDetails.keywords")}
          />
          <InputField
            label="Canonical URL"
            type="url"
            value={formData.seoDetails.canonicalUrl}
            onChange={(e) => handleChange(e, "seoDetails.canonicalUrl")}
          />
        </div>

        {errMessage && <p className="text-red-500 mb-4 mt-6">{errMessage}</p>}

       
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2.5 px-6 rounded-lg transition"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};


const SectionTitle = ({ title }) => (
  <h2 className="text-xl font-semibold text-purple-950">
    <span className="text-orange-500">*</span> {title}
  </h2>
);

const GridTwo = ({ children }) => (
  <div className="grid grid-cols-2 gap-6 p-4 bg-purple-50/50 rounded-lg">
    {children}
  </div>
);

const InputField = ({ label, type = "text", value, onChange, required, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label>{label}</label>
    <input
      type={type}
      className="border border-neutral-200 bg-white rounded-lg py-2.5 px-5 outline-none"
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

const TextareaField = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label>{label}</label>
    <textarea
      rows={3}
      className="border border-neutral-200 bg-white rounded-lg py-2.5 px-5 outline-none resize-none"
      value={value}
      onChange={onChange}
    />
  </div>
);


const getValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc && acc[key], obj);

export default UpdateWebsiteComponent;

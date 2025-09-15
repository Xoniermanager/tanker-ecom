const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const encryptionPlugin = require("../plugins/encryptionPlugin");
const ENUMS = require("../constants/enums");
const { getPublicFileUrl } = require("../utils/storage");

const siteSettingSchema = new mongoose.Schema(
  {
     shippingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    contactDetails: {
      emails: {
        // sales_enquiry: { type: String, required: true },
        // bdm: { type: String, required: true },
        footer: { type: String, required: true },
      },
      phoneNumbers: {
        // service_depot: { type: String, required: true },
        contact_one: { type: String, required: true },
        contact_two: { type: String, required: true },
      },
      addresses: {
        head_office: { type: String, required: true },
        address_link: {
          type: String,
          trim: true,
          match: [
            /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/,
            "Please enter a valid URL",
          ],
        },
        service_depot: { type: String, required: true },
      },
      socialMediaLinks: {
        facebook: {
          type: String,
          match: [
            /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/,
            "Please enter a valid URL",
          ],
        },
        twitter: {
          type: String,
          match: [
            /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/,
            "Please enter a valid URL",
          ],
        },
        linkedin: {
          type: String,
          match: [
            /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/,
            "Please enter a valid URL",
          ],
        },
        instagram: {
          type: String,
          match: [
            /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/,
            "Please enter a valid URL",
          ],
        },
        youtube: {
          type: String,
          match: [
            /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/,
            "Please enter a valid URL",
          ],
        },
      },
    },
    siteDetails: {
      logo: {
        url: { type: String },
        key: { type: String },
      },
      title: { type: String },
      slogan: { type: String },
      description: { type: String },
      copyright: { type: String, trim: true },
    },
    seoDetails: new mongoose.Schema(
      {
        metaTitle: { type: String },
        metaDescription: { type: String },
        keywords: [String],
        canonicalUrl: { type: String },
        // ogImage: { type: String },
      },
      { _id: false }
    ),
  },
  { timestamps: true }
);

siteSettingSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    const logo = ret?.siteDetails?.logo;
    if (logo && logo.key) {
      logo.fullUrl = getPublicFileUrl(logo.key);
    } else if (logo && logo.url) {
      logo.fullUrl = getPublicFileUrl(logo.url);
    }
    return ret;
  },
});

module.exports = mongoose.model("SiteSetting", siteSettingSchema);

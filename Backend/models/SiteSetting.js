const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const encryptionPlugin = require("../plugins/encryptionPlugin");
const ENUMS = require("../constants/enums");
const { getPublicFileUrl } = require("../utils/storage");

const siteSettingSchema = new mongoose.Schema({
    contactDetails: {
        emails: {
            sales_enquiry: { type: String, required: true },
            bdm: { type: String, required: true },
            footer: { type: String, required: true }
        },
        phoneNumbers: {
            service_depot: { type: String, required: true },
            contact_one: { type: String, required: true },
            contact_two: { type: String, required: true }
        },
        addresses: {
            head_office: { type: String, required: true },
            service_depot: { type: String, required: true }
        },
        socialMediaLinks: {
            facebook: { type: String },
            twitter: { type: String },
            linkedin: { type: String },
            instagram: { type: String },
            youtube: { type: String }
        }
    },
    siteDetails: {
        logo: {
            url: { type: String },
            key: { type: String }
        },
        title: { type: String },
        slogan: { type: String },
        description: { type: String }
    },
    seoDetails: new mongoose.Schema({
        metaTitle: { type: String },
        metaDescription: { type: String },
        keywords: [String],
        canonicalUrl: { type: String },
        ogImage: { type: String }
    }, { _id: false })
}, { timestamps: true });

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
    }
});

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
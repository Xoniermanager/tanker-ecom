require("dotenv").config();
const MongoDB = require("./database");
const User = require("../models/user.model");
const { default: mongoose } = require("mongoose");
const ENUMS = require("../constants/enums");
const SiteSetting = require("../models/SiteSetting");

const seedAppConfig = async () => {
    await MongoDB.connect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        /**
         ** Seed Admin User
         */
        console.log("Seeding admin user...");

        const existingAdmin = await User.findOne({ companyEmail: "admin@company.com", role: "admin" });
        if (existingAdmin) {
            console.log("Admin already exists. Skipping admin seeding.");
        } else {
            const admin = new User({
                "companyEmail": "admin@company.com",
                "companyName": "Tanker Ecom Solutions",
                "fullName": "Admin",
                "designation": "Admin",
                "mobileNumber": "+919192939495",
                "country": "India",
                "password": "StrongPassword123",
                "role": ENUMS.USER_ROLES.ADMIN,
                "emailVerifiedAt": new Date(),
            });

            await admin.save();
            console.log("Admin user created successfully:", admin.companyEmail);
        }

        /**
         ** Seed Default Site Settings
         */
        console.log("Seeding site settings...");

        const existingSettings = await SiteSetting.findOne();
        if (existingSettings) {
            console.log("Site settings already exist. Skipping setting seeding.");
        } else {
            const setting = new SiteSetting({
                siteDetails: {
                    logo: "logo",
                    title: "Tanker Solutions",
                    slogan: "Tanker Solutions NZ-made and international offerings",
                    description: "Tanker Solutions is dedicated to providing the best quality cost effective solution to your fuel and dry bulk transport and delivery needs.",
                },
                contactDetails: {
                    emails: {
                        sales_enquiry: "mark@tankersolutions.co.nz",
                        bdm: "scott@tankersolutions.co.nz",
                        footer: "support@tankersolutions.co.nz"
                    },
                    phoneNumbers: {
                        service_depot: "027 525 0551",
                        contact_one: "+64 4 027 428 1896",
                        contact_two: "+64 4 027 428 8265"
                    },
                    addresses: {
                        head_office: "8-10 Makaro Street, Porirua, 5022, NEW ZEALAND",
                        service_depot: "21A Barnes Street, Seaview, Lower Hutt, 5010"
                    },
                    socialMediaLinks: {
                        facebook: "",
                        twitter: "",
                        instagram: "",
                        linkedin: "",
                        youtube: ""
                    }
                },
                seoDetails: {
                    metaTitle: "Tanker Solutions - NZ-made and international fuel system specialists",
                    metaDescription: "Tanker Solutions offers NZ-made and international products including fuel system design, welding, fabrication, laser cutting, and compliance testing.",
                    keywords: [
                        "Tanker Solutions",
                        "vehicle fabrication",
                        "laser cutting",
                        "fuel compliance",
                        "New Zealand",
                        "B2B fuel services"
                    ]
                }
            });

            await setting.save({ session });
            console.log("Site settings seeded successfully.");
        }

        await session.commitTransaction();
        console.log("App configuration completed.");
        process.exit(0);
    } catch (error) {
        console.error("Error during app configuration:", error);
        await session.abortTransaction();
        process.exit(1);
    } finally {
        await session.endSession();
    }
};

seedAppConfig();
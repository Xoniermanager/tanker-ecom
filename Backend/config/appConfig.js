require("dotenv").config();
const MongoDB = require("./database");
const User = require("../models/user.model");
const { default: mongoose } = require("mongoose");
const ENUMS = require("../constants/enums");

const seedAppConfig = async () => {
    try {
        await MongoDB.connect();
        const session = await mongoose.startSession();
        session.startTransaction();

        /**
         ** Seed Admin User
         */
        console.log("Seeding admin user...");

        const existingAdmin = await User.findOne({ email: "admin@example.com", role: "admin" });
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
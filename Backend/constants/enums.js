module.exports = {
    USER_ROLES: {
        USER: "user",
        ADMIN: "admin",
    },
    USER_STATUS: {
        ACTIVE: "active",
        INACTIVE: "inactive",
        BLOCKED: "blocked",
    },
    COMMUNICATION_PREFERENCE: {
        EMAIL: "email",
        SMS: "sms",
        PHONE: "phone",
        WHATSAPP: "whatsapp",
    },
    LANGUAGES: ["en", "es", "fr", "de"],
    COUNTRIES: ["India", "USA", "UK", "Germany", "Australia"],
    OTP_TYPES: {
        EMAIL_VERIFICATION: "email_verification",
        LOGIN_OTP: "login_otp",
        PASSWORD_RESET: "password_reset",
    },
    OTP_EXPIRY_DURATION: {
        email_verification: 10 * 60 * 1000, // 10 minutes
        login_otp: 5 * 60 * 1000, // 5 minutes
        password_reset: 10 * 60 * 1000, // 10 minutes
    },
    STOCK_STATUS:{
        IN_STOCK: "in_stock",
        OUT_OF_STOCK: "out_of_stock",
        PRE_ORDER: "pre_order"
    }
};

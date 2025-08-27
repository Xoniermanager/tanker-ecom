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
    },
    PRODUCT_STATUS:{
        ACTIVE: "active",
        INACTIVE: "inactive"
    },
    ORDER_STATUS:{
        PENDING: "pending",
        PROCESSING: "processing",
        SHIPPED: "shipped",
        DELIVERED: "delivered",
        CANCELLED: "cancelled"
    },
    PAYMENT_METHODS:{
        COD:"cod",
        ONLINE_PAYMENT: "online_payment"
    },

    NEWZEALAND_REGIONS : {
    // North Island
    NORTHLAND: "northland",
    AUCKLAND: "auckland", 
    WAIKATO: "waikato",
    BAY_OF_PLENTY: "bay_of_plenty",
    GISBORNE: "gisborne",
    HAWKES_BAY: "hawkes_bay",
    TARANAKI: "taranaki",
    MANAWATU_WHANGANUI: "manawatu_whanganui",
    WELLINGTON: "wellington",
    
    // South Island
    TASMAN: "tasman",
    NELSON: "nelson",
    MARLBOROUGH: "marlborough",
    WEST_COAST: "west_coast",
    CANTERBURY: "canterbury",
    OTAGO: "otago",
    SOUTHLAND: "southland"
}

};

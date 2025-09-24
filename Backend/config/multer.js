const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
   
    if (
        file.mimetype.startsWith("image/") || 
        file.mimetype.startsWith("video/") ||
        file.mimetype === "text/csv" ||
        file.mimetype === "application/csv" ||
        file.mimetype === "text/plain" ||
        file.originalname.toLowerCase().endsWith('.csv')
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image, video, and CSV files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    },
});

module.exports = upload;

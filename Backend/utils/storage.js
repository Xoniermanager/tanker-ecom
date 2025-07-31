const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const STORAGE_DRIVER = process.env.STORAGE_DRIVER || "local";

// AWS S3 setup
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// ------------------ UPLOAD FUNCTION ------------------ //
const uploadImage = async (buffer, filename, folder = "uploads", mimetype = "image/jpeg") => {
    const uniqueName = `${uuid()}-${filename.replace(/\s+/g, "-").toLowerCase()}`;

    if (STORAGE_DRIVER === "s3") {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folder}/${uniqueName}`,
            Body: buffer,
            ContentType: mimetype,
            ACL: "public-read",
        };

        const result = await s3.upload(params).promise();
        return { url: result.Location, key: result.Key };
    } else {
        const uploadPath = path.join(__dirname, "..", "public", folder);
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

        const fullPath = path.join(uploadPath, uniqueName);

        await fs.promises.writeFile(fullPath, buffer);
        return { url: `/public/${folder}/${uniqueName}`, key: `${folder}/${uniqueName}` };
    }
};

// ------------------ DELETE FUNCTION ------------------ //
const deleteImage = async (key) => {
    if (!key) return;

    if (STORAGE_DRIVER === "s3") {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };
        await s3.deleteObject(params).promise();
    } else {
        const fullPath = path.join(__dirname, "..", key);
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
    }
};

// ------------------ Get Public URL of File ------------------ //
function getPublicFileUrl(keyOrUrl) {
    const storageDriver = process.env.STORAGE_DRIVER || "local";

    if (!keyOrUrl) return null;

    if (storageDriver === "s3") {
        const bucketBaseUrl = process.env.AWS_PUBLIC_URL;
        return `${bucketBaseUrl}/${keyOrUrl}`;
    }

    const baseUrl = process.env.LOCAL_PUBLIC_URL;
    const filePath = keyOrUrl.startsWith("/") ? keyOrUrl : `/${keyOrUrl}`;
    return `${baseUrl}${filePath}`;
}

module.exports = {
    uploadImage,
    deleteImage,
    getPublicFileUrl
};
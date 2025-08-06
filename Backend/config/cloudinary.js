const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

function getResourceType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const videoExts = ['.mp4', '.avi', '.mkv', '.webm'];
  const imageExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (videoExts.includes(ext)) return 'video';
  if (imageExts.includes(ext)) return 'image';
  return 'auto';
}

const CloudUpload = async (buffer, filename, folder = 'uploads') => {
  const resourceType = getResourceType(filename);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: `${folder}/${Date.now()}-${filename}`,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = CloudUpload;

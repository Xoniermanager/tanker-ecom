/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            new URL("https://tanker-ecom.onrender.com/public/uploads/**")
            // new URL("https://res.cloudinary.com/**")
           
        ],
        unoptimized: true,

    },
    
};

export default nextConfig;

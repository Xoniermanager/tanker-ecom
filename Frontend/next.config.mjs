/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            new URL("https://tanker-ecom.onrender.com/public/uploads/**")
           
        ],
        unoptimized: true,

    },
    
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            new URL("http://localhost:3000/public/uploads/**")
           
        ],
        unoptimized: true,

    },
    
};

export default nextConfig;

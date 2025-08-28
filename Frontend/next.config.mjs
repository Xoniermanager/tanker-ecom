/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            new URL("https://tanker-ecom.onrender.com/public/uploads/**")
            // new URL("https://res.cloudinary.com/**")
           
        ],
        unoptimized: true,

    },
    // async rewrites() {
    //     return [
    //         {
    //             source: "/api/:path*",
    //             destination: "http://localhost:3000/api/:path*",
    //         },
    //     ];
    // },
    
};

export default nextConfig;

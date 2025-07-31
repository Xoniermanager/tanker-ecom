/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            new URL("http://localhost:3000/public/uploads/**")
            // {
            //     protocol: "http",
            //     hostname: "localhost:3000",
                
            // }
        ]
    },
    
};

export default nextConfig;

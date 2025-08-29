import axios from "axios";
import Cookies from "js-cookie";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true
})

// const api = axios.create({
//   baseURL: "/api",          
//   withCredentials: true,    
// });

// api.interceptors.request.use((config)=>{
//     const token = Cookies.get("accessToken")
//     if(token){
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
// },(err)=>{
//     return Promise.reject(err)
// })

export default api
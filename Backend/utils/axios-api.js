const axios = require("axios")

const mainfreightApi = axios.create({
    baseURL: process.env.MAINFREIGHT_URL
})

mainfreightApi.interceptors.request.use((config)=>{
    const apiKey = process.env.MAINFREIGHT_API_KEY
    console.log("apiKey: ", apiKey)
     if(apiKey){
        config.headers.Authorization = `Secret ${apiKey}`
     }
     config.headers["Content-Type"] = "application/json; charset=utf-8"
   
     return config
 },(err)=>{
     return Promise.reject(err)
 })


module.exports = {mainfreightApi}
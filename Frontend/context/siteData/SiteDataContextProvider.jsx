"use client"
const { useState, useEffect } = require("react")
const { SiteContext } = require("./SiteDataContext");
const { default: api } = require("../../components/user/common/api");

const SiteDataContextProvider = ({children})=>{
    const [siteData, setSiteData] = useState(null);
    const [isSiteDataLoading, setIsSiteDataLoading] = useState(false)

    const fetchSiteData = async()=>{
        setIsSiteDataLoading(true)
        try {
            const response = await api.get(`/site-settings`)
            if(response.status === 200){
                setSiteData(response.data.data)
            }
        } catch (error) {
            if(process.env.NEXT_PUBLIC_NODE_ENV === "development"){
                console.error(error)
            }
        } finally {
            setIsSiteDataLoading(false)
        }
    }

    useEffect(() => {
      fetchSiteData()
    }, [])
    
    return <SiteContext.Provider value={{siteData, isSiteDataLoading}}>
      {children}
    </SiteContext.Provider>
}

export default SiteDataContextProvider
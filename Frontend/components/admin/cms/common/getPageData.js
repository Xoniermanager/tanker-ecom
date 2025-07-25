
const { default: api } = require("../../../user/common/api");

let pageId;

if(window.location.pathname === "/"){
    pageId = "home"
}
else{
    pageId = window.location.pathname.split("/").pop();
}







export const getPageData = async()=>{
    if(!pageId) return "page id not found"
    try {
        const response = await api.get(`/cms/pages/${pageId}`)
        if(response.status === 200){
            return response.data
        }
    } catch (error) {
        console.log(error)
    }

}

const { default: api } = require("../../../user/common/api");

export const getPageData = async () => {
  try {
    let pageId;

    if (window?.location?.pathname === "/") {
      pageId = "home";
    } else {
      pageId = window?.location?.pathname.split("/").pop();
    }
    const response = await api.get(`/cms/pages/${pageId}`);
    if (response.status === 200 || response.status === 304) {
      console.log("page data: ", response.data);
      return response.data;
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

const dashboardService = require("../services/dashboard.service");
const customResponse = require("../utils/response");


class DashboardController {
    getDashboardStatus = async(req, res,next)=>{
       try {
        const {timeframe, month} = req.query;
        const days = parseInt(timeframe) || 30;
        const monthForSaleCount = parseInt(month) || 1;

        const result = await dashboardService.getDashboardStatus(days, monthForSaleCount);
        return customResponse(res, "Dashboard data fetched successfully", result);

       } catch (error) {
        next(error)
       }
    }
}

const dashboardController = new DashboardController()

module.exports = dashboardController
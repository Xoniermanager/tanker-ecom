const dashboardService = require("../services/dashboard.service");
const customResponse = require("../utils/response");


class DashboardController {
    getDashboardStatus = async(req, res,next)=>{
       try {
        const {timeframe} = req.query;
        const days = parseInt(timeframe) || 30;

        const result = await dashboardService.getDashboardStatus(days)
        return customResponse(res, "Dashboard data fetched successfully", result)

       } catch (error) {
        next(error)
       }
    }
}

const dashboardController = new DashboardController()

module.exports = dashboardController
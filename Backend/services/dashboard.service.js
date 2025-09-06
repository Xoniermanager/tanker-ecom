const customError = require("../utils/error")
const orderRepository = require("../repositories/product/order.repository");
const { startSession } = require("mongoose");
const productRepository = require("../repositories/product/product.repository");
const inventoryRepository = require("../repositories/product/inventory.repository");
const productCategoryRepository = require("../repositories/product/product-category.repository");


class DashboardService{
     getDashboardStatus = async (days = 30) => {
        
        if (days < 1 || days > 365) {
            throw customError("Invalid day range, days should be between 1 to 365", 400);
        }

        const session = await startSession();

        try {
            let result;

            await session.withTransaction(async () => {
                
                const currentEndDate = new Date();
                const currentStartDate = new Date();
                currentStartDate.setDate(currentEndDate.getDate() - days);

                const previousEndDate = new Date(currentStartDate);
                const previousStartDate = new Date(currentStartDate);
                previousStartDate.setDate(previousStartDate.getDate() - days);

                
                const [totalOrders, deliveredOrders, arrivedOrders, totalSales, topSellingProducts, topSellingCategories] = await Promise.all([
                    orderRepository.getOrdersCount(currentStartDate, currentEndDate, session),
                    orderRepository.getDeliveredOrdersCount(currentStartDate, currentEndDate, session),
                    orderRepository.getArrivedOrdersCount(currentStartDate, currentEndDate, session),
                    orderRepository.getTotalRevenue(currentStartDate, currentEndDate, session),
                    inventoryRepository.getTopSellingProducts(null, session),
                    productCategoryRepository.getTopCategories(8,"totalSales")
                    
                ]);

                
                const [prevTotalOrders, prevDeliveredOrders, prevArrivedOrders, prevTotalSales] = await Promise.all([
                    orderRepository.getOrdersCount(previousStartDate, previousEndDate, session),
                    orderRepository.getDeliveredOrdersCount(previousStartDate, previousEndDate, session),
                    orderRepository.getArrivedOrdersCount(previousStartDate, previousEndDate, session),
                    orderRepository.getTotalRevenue(previousStartDate, previousEndDate, session)
                ]);

                
                const calculateProfiteWithPrev = (current, prev) => {
                    if (prev === 0) return current > 0 ? 100 : 0;
                    return Number(((current - prev) / prev * 100).toFixed(1));
                };

                result = {
                    data: {
                        totalOrders: {
                            count: totalOrders,
                            salesPercent: calculateProfiteWithPrev(totalOrders, prevTotalOrders),
                            isPositive: totalOrders >= prevTotalOrders
                        },
                        deliveredOrders: {
                            count: deliveredOrders,
                            salesPercent: calculateProfiteWithPrev(deliveredOrders, prevDeliveredOrders),
                            isPositive: deliveredOrders >= prevDeliveredOrders
                        },
                        arrivedOrders: {
                            count: arrivedOrders,
                            salesPercent: calculateProfiteWithPrev(arrivedOrders, prevArrivedOrders),
                            isPositive: arrivedOrders >= prevArrivedOrders
                        },
                        totalRevenue: {
                            revenue: totalSales,
                             salesPercent: calculateProfiteWithPrev(totalSales, prevTotalSales),
                             isPositive: totalSales >= prevTotalSales
                        } ,
                        topSellingProducts,
                        topSellingCategories

                        
                    },
                    meta: {
                        days,
                        period: {
                            current: { start: currentStartDate, end: currentEndDate },
                            previous: { start: previousStartDate, end: previousEndDate }
                        }
                    }
                };
            });

            return result;

        } catch (error) {
            // await session.abortTransaction();
            throw customError("Failed to fetch dashboard statistics", 500);
        } finally {
            await session.endSession();
        }
    };
}

const dashboardService = new DashboardService()
module.exports = dashboardService
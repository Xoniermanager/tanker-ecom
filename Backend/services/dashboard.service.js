const customError = require("../utils/error")
const orderRepository = require("../repositories/product/order.repository");
const { startSession } = require("mongoose");
const productRepository = require("../repositories/product/product.repository");
const inventoryRepository = require("../repositories/product/inventory.repository");
const productCategoryRepository = require("../repositories/product/product-category.repository");
const contactRepository = require("../repositories/contact.repository");
const userRepository = require("../repositories/user.repository");


class DashboardService{
     getDashboardStatus = async (days = 30, month = 1) => {
        
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
                const weekStartDate = new Date();
        weekStartDate.setDate(currentEndDate.getDate() - 7);

                const previousEndDate = new Date(currentStartDate);
                const previousStartDate = new Date(currentStartDate);
                previousStartDate.setDate(previousStartDate.getDate() - days);

                
                const [totalOrders, deliveredOrders, arrivedOrders, totalSales, totalQuery, topSellingProducts, topSellingCategories, newUsers, weeklyOrderCount, orderSaleCountWithSale] = await Promise.all([
                    orderRepository.getOrdersCount(currentStartDate, currentEndDate, session),
                    orderRepository.getDeliveredOrdersCount(currentStartDate, currentEndDate, session),
                    orderRepository.getArrivedOrdersCount(currentStartDate, currentEndDate, session),
                    orderRepository.getTotalRevenue(currentStartDate, currentEndDate, session),
                    contactRepository.getTotalQuery(currentStartDate, currentEndDate, session),
                    inventoryRepository.getTopSellingProducts(null, session),
                    productCategoryRepository.getTopCategories(8,"totalSales"),
                    userRepository.getUsers(currentStartDate, currentEndDate, session),
                    orderRepository.getWeeklyOrderCount(weekStartDate, session),
                    orderRepository.getOrderCountWithSaleCount(month, session)
                    
                ]);

                
                const [prevTotalOrders, prevDeliveredOrders, prevArrivedOrders, prevTotalSales, prevTotalQuery, prevNewUsers] = await Promise.all([
                    orderRepository.getOrdersCount(previousStartDate, previousEndDate, session),
                    orderRepository.getDeliveredOrdersCount(previousStartDate, previousEndDate, session),
                    orderRepository.getArrivedOrdersCount(previousStartDate, previousEndDate, session),
                    orderRepository.getTotalRevenue(previousStartDate, previousEndDate, session),
                    contactRepository.getTotalQuery(previousStartDate, previousEndDate, session),
                    userRepository.getUsers(previousStartDate, previousEndDate, session)
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
                        totalQuery:{
                            count: totalQuery,
                            queryPercent: calculateProfiteWithPrev(totalQuery, prevTotalQuery),
                            isPositive: totalQuery >= prevTotalQuery
                        },
                        topSellingProducts,
                        topSellingCategories,
                        totalUsers:{
                            count: newUsers,
                            queryPercent: calculateProfiteWithPrev(newUsers, prevNewUsers),
                            isPositive: newUsers >= prevNewUsers
                        },
                        weeklyOrderCount,
                        orderSaleCountWithSale

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
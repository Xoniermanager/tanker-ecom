const BaseRepository = require("../base.repository");
const Order = require('../../models/product/order.model')


class OrderRepository extends BaseRepository{
    constructor(){
        super(Order)
    }
}

const orderRepository = new OrderRepository();

module.exports = orderRepository
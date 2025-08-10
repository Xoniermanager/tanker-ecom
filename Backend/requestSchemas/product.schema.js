const { z } = require("zod");
const {STOCK_STATUS} = require("../constants/enums");


const productCategorySchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    
})

module.exports = {productCategorySchema}
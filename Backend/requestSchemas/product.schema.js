const { z } = require("zod");
const {STOCK_STATUS, PRODUCT_STATUS} = require("../constants/enums");

const thumbnailSchema = z
    .object({
        type: z.enum(["video", "image"]),
        source: z.string(),
    });


const productCategorySchema = z.object({
    name: z.string(),
    slug: z.string(),
    status:z.boolean().optional(),
    description: z.string().optional(),
    
})


const specificationSchema = z.object({
  Key_parameter: z
    .string()
    .min(1, { message: "Key_parameter is required" }),
  values: z
    .record(z.any()) 
    .refine(val => Object.keys(val).length > 0, {
      message: "Values object cannot be empty",
    }),
});


const highlightsSchema = z.array(z.string()).max(10, {message: "Maximum highlights limit is 10"})


const productSchema = z.object({
    name: z.string({message: "Product name must required"}),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ObjectId format" }),
    regularPrice: z.number().min(0),
    sellingPrice: z.number().min(0),
    shortDescription: z.string(),
    brand: z.string(),
    description: z.string(),
    highlights: highlightsSchema,
    specifications: specificationSchema,
    specifications_search_index: z.array(z.string().min(1, { message: "Specification search index item cannot be empty" })).optional(),
    status: z.enum(Object.values(PRODUCT_STATUS), {message: "Invalid status preference"}),
    slug: z.string().min(1, {message: "slug is required"}),
    origin: z.string().optional(),
    images: z.array(thumbnailSchema)

})



module.exports = {productCategorySchema, productSchema}
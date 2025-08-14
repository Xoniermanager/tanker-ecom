// const { z } = require("zod");
// const { STOCK_STATUS, PRODUCT_STATUS } = require("../constants/enums");

// const thumbnailSchema = z
//   .object({
//     type: z.enum(["video", "image"]),
//     source: z.string(),
//   });

// const specificationSchema = z.object({
//   Key_parameter: z
//     .string()
//     .min(1, { message: "Key_parameter is required" }),
//   values: z
//     .record(z.any())
//     .refine(val => Object.keys(val).length > 0, {
//       message: "Values object cannot be empty",
//     }),
// });

// const highlightsSchema = z.array(z.string()).max(10, { message: "Maximum highlights limit is 10" })

// const productSchema = z.object({
//   name: z.string({ message: "Product name must required" }),
//   category: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ObjectId format" }),
//   regularPrice: z.number().min(0),
//   sellingPrice: z.number().min(0),
//   shortDescription: z.string(),
//   brand: z.string(),
//   description: z.string(),
//   highlights: highlightsSchema,
//   specifications: specificationSchema,
//   specifications_search_index: z.array(z.string().min(1, { message: "Specification search index item cannot be empty" })).optional(),
//   status: z.enum(Object.values(PRODUCT_STATUS), { message: "Invalid status preference" }),
//   slug: z.string().min(1, { message: "slug is required" }),
//   origin: z.string().optional(),
//   images: z.array(thumbnailSchema)
// })

// module.exports = { productCategorySchema, productSchema }

const { z } = require("zod");
const { PRODUCT_STATUS } = require("../constants/enums");

const imageSchema = z.object({
  source: z.string({
    required_error: "Image source is required.",
    invalid_type_error: "Image source must be a string.",
  }),
  type: z.literal("image").default("image"),
});

const productSchema = z.object({
  name: z.string({
    required_error: "Product name is required.",
    invalid_type_error: "Product name must be a string.",
  }).min(1, { message: "Product name cannot be empty." }),

  category: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ObjectId format." }),

  regularPrice: z
    .string({
      required_error: "Regular price is required.",
    })
    .regex(/^\d+(\.\d+)?$/, "Regular price must be a valid number.")
    .transform(Number)
    .refine(val => val >= 0, { message: "Regular price cannot be negative." }),

  sellingPrice: z
    .string({
      required_error: "Selling price is required.",
    })
    .regex(/^\d+(\.\d+)?$/, "Selling price must be a valid number.")
    .transform(Number)
    .refine(val => val >= 0, { message: "Selling price cannot be negative." }),

  shortDescription: z.string({
    required_error: "Short description is required.",
    invalid_type_error: "Short description must be a string.",
  }).min(1, { message: "Short description cannot be empty." }),

  description: z.string({
    required_error: "Description is required.",
    invalid_type_error: "Description must be a string.",
  }),

  brand: z.string({
    required_error: "Brand is required.",
    invalid_type_error: "Brand must be a string.",
  }),

  origin: z.string().optional(),

  highlights: z.array(z.string()).max(10, { message: "Maximum highlights limit is 10." }).optional(),

  specifications: z.object({
    type: z.enum(["pdf", "image"], {
      invalid_type_error: "Specification type must be 'pdf' or 'image'."
    }).optional(),
    source: z.string().optional()
  }).optional(),

  initialQuantity: z
    .string({ required_error: "Initial quantity is required." })
    .regex(/^\d+$/, "Initial quantity must be a valid integer.")
    .transform(Number)
    .refine(val => val >= 0, { message: "Quantity must be 0 or greater" }),

  slug: z.string().optional(),

  status: z.enum(Object.values(PRODUCT_STATUS)).default(PRODUCT_STATUS.ACTIVE),

  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

const productCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  status: z.boolean().optional(),
  description: z.string().optional(),
});

const updateProductSchema = productSchema.omit({ initialQuantity: true });

module.exports = {
  productSchema,
  updateProductSchema,
  productCategorySchema,
};

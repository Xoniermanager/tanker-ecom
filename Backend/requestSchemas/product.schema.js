const { z } = require("zod");
const { PRODUCT_STATUS, STOCK_STATUS, ORDER_STATUS, PAYMENT_METHODS, NEWZEALAND_REGIONS } = require("../constants/enums");

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

const updateInventorySchema = z.object({
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be 0 or greater"),
  status: z.enum(Object.values(STOCK_STATUS)).default(STOCK_STATUS.IN_STOCK)
})

const productFieldSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ObjectId format" }),
  name: z.string({required_error: "Product Name field must required"}),
  quantity: z.number().min(1, {message: "quantity can't be zero or negative"}),
  sellingPrice: z.number().min(0, {message: "selling price can't be negative"})
})

const addressSchema = z.object({
  address: z.string({required_error: "address is required"}).trim(),
  state: z.enum(Object.values(NEWZEALAND_REGIONS)),
  pincode: z.number().min(1000, { message: "Pincode must be at least 1000" }).max(9999, { message: "Pincode must be at most 9999" }),
})

const orderSchema = z.object({
  firstName: z.string({required_error: "First field must required"}),
  lastName: z.string({required_error: "Last name must be required"}),
  email: z.string({required_error: "Email is required" }).email({message: "Invalid email format"}),
  phone: z.string().regex(/^(\+64|0)(2\d{7,9}|[34679]\d{7,8})$/, {message: "Invalid New Zealand phone number format"}),
  products: z.array(productFieldSchema).min(1, { message: "At least one product required"}),
  address: z.object({billingAddress: addressSchema, shippingAddress: addressSchema}),
  paymentMethod: z.enum(Object.values(PAYMENT_METHODS)),
  paymentResult: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid payment result ObjectId format" }).optional(),
  orderNotes: z.string().optional()
})

const paymentResultSchema = z.object({
  transactionId: z.string({required_error: "TransactionId must required"}).trim(),
  paymentStatus: z.boolean().default(false),
  paymentResponse: z.any()
})

module.exports = {
  productSchema,
  updateProductSchema,
  productCategorySchema,
  updateInventorySchema,
  paymentResultSchema, 
  orderSchema
};

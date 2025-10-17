const { z } = require("zod");
const {
  PRODUCT_STATUS,
  STOCK_STATUS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  NEWZEALAND_REGIONS,
  COUNTRIES,
  PACKAGE_TYPE,
} = require("../constants/enums");

const countries = Object.values(COUNTRIES).map((item) => item.code);
const imageSchema = z.object({
  source: z.string({
    required_error: "Image source is required.",
    invalid_type_error: "Image source must be a string.",
  }),
  type: z.literal("image").default("image"),
});

const measurementsSchema = z.object({
  measurementName: z.string().trim(),
  measurementValue: z.string().trim(),
});

const specificationsSchema = z.object({
  height: z
    .string()
    .trim()
    .regex(
      /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2})(?:\.[0-9]{1,2})?$/,
      "Height must be a valid number in meters (0-999.99m)"
    ),
  length: z
    .string()
    .trim()
    .regex(
      /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2})(?:\.[0-9]{1,2})?$/,
      "Length must be a valid number in meters (0-999.99m)"
    ),
  width: z
    .string()
    .trim()
    .regex(
      /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2})(?:\.[0-9]{1,2})?$/,
      "Width must be a valid number in meters (0-999.99m)"
    ),
  weight: z
    .string()
    .trim()
    .regex(/^\d+(\.\d+)?$/, "Weight must be a valid number")
    .transform((val) => {
      const num = parseFloat(val);
      return Math.floor(num).toString();
    }),
  volume: z
    .string()
    .trim()
    .regex(
      /^(?:[0-9]|[1-9][0-9]{1,4})(?:\.[0-9]{1,2})?$/,
      "Volume must be a valid number in cubic meters (0-99999.99m³)"
    ),
  packTypeCode: z.enum(Object.values(PACKAGE_TYPE).map((item) => item.code)),
});

const productSchema = z.object({
  partNumber: z.string({
    required_error: "Part number is required.",
    invalid_type_error: "Part number must be a string.",
  }),
  name: z
    .string({
      required_error: "Product name is required.",
      invalid_type_error: "Product name must be a string.",
    })
    .min(1, { message: "Product name cannot be empty." }),

  category: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid category ObjectId format.",
  }),

  regularPrice: z
    .string({
      required_error: "Regular price is required.",
    })
    .regex(/^\d+(\.\d+)?$/, "Regular price must be a valid number.")
    .transform(Number)
    .refine((val) => val >= 0, {
      message: "Regular price cannot be negative.",
    }),

  sellingPrice: z
    .string({
      required_error: "Selling price is required.",
    })
    .regex(/^\d+(\.\d+)?$/, "Selling price must be a valid number.")
    .transform(Number)
    .refine((val) => val >= 0, {
      message: "Selling price cannot be negative.",
    }),

  // shippingPrice: z
  //   .string({
  //     required_error: "Shipping price is required.",
  //   })
  //   .regex(/^\d+(\.\d+)?$/, "Shipping price must be a valid number.")
  //   .transform(Number)
  //   .refine(val => val >= 0, { message: "Shipping price cannot be negative." }),

  shortDescription: z
    .string({
      required_error: "Short description is required.",
      invalid_type_error: "Short description must be a string.",
    })
    .min(1, { message: "Short description cannot be empty." }),

  description: z.string({
    required_error: "Description is required.",
    invalid_type_error: "Description must be a string.",
  }),

  brand: z.string({
    required_error: "Brand is required.",
    invalid_type_error: "Brand must be a string.",
  }),

  origin: z.string().optional(),

  highlights: z
    .array(z.string())
    .max(10, { message: "Maximum highlights limit is 10." })
    .optional(),

  images: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, z.array(imageSchema).optional()),

  specificationsDoc: z
    .object({
      type: z
        .enum(["pdf", "image"], {
          invalid_type_error: "Specification type must be 'pdf' or 'image'.",
        })
        .optional(),
      source: z.string().optional(),
    })
    .optional(),

  initialQuantity: z
    .string({ required_error: "Initial quantity is required." })
    .regex(/^\d+$/, "Initial quantity must be a valid integer.")
    .transform(Number)
    .refine((val) => val >= 0, { message: "Quantity must be 0 or greater" }),

  slug: z.string().optional(),

  status: z.enum(Object.values(PRODUCT_STATUS)).default(PRODUCT_STATUS.ACTIVE),
  measurements: z.array(measurementsSchema).optional(),
  deliveryDays: z
    .string({
      required_error: "Delivery days is required.",
      invalid_type_error: "Delivery days must be a string.",
    })
    // .regex(/^\d+$/, "Delivery days must contain only digits.")
    .refine((val) => parseInt(val) >= 0, {
      message: "Delivery days cannot be negative.",
    })
    .default("10"),

shippingCharge: z
  .coerce.number({
    required_error: "Shipping charge is required",
    invalid_type_error: "Shipping charge must be a number"
  })
  .min(0, "Shipping charge must be greater than or equal to 0")
  .transform((val) => Math.round(val * 100) / 100),
  // specifications: specificationsSchema,

  shipping: z
    .string({
      invalid_type_error: "Shipping must be a string.",
    })
    .optional(),

  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
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
  status: z.enum(Object.values(STOCK_STATUS)).default(STOCK_STATUS.IN_STOCK),
});

const productFieldSchema = z.object({
  product: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ObjectId format" }),
  name: z.string({ required_error: "Product Name field must required" }),
  quantity: z
    .number()
    .min(1, { message: "quantity can't be zero or negative" }),
  sellingPrice: z
    .number()
    .min(0, { message: "selling price can't be negative" }),
});

const addressSchema = z.object({
  address: z.string({ required_error: "address is required" }).trim(),
  // state: z.enum(Object.values(NEWZEALAND_REGIONS)),
  country: z.enum(Object.values(countries)),
  city: z.string({ required_error: "City field must required" }),
  pincode: z
    .number()
    .min(1000, { message: "Pincode must be at least 1000" })
    .max(999999, { message: "Pincode must be at most 999999" }),
});

const orderSchema = z.object({
  firstName: z.string({ required_error: "First field must required" }),
  lastName: z.string({ required_error: "Last name must be required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" }),
  phone: z.string(),
  // .regex(/^(\+64|0)(2\d{7,9}|[34679]\d{7,8})$/, { message: "Invalid New Zealand phone number format" }),
  products: z
    .array(productFieldSchema)
    .min(1, { message: "At least one product required" }),
  
  address: z.object({
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
  }),
  paymentMethod: z.enum(Object.values(PAYMENT_METHODS)),
  shippingPrice: z.number({ required_error: "Shipping charge is required" }).min(0).optional(),
  paymentResult: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid payment result ObjectId format",
    })
    .optional(),
  orderNotes: z.string().optional(),
});


const paymentResultSchema = z.object({
  transactionId: z
    .string({ required_error: "TransactionId must required" })
    .trim(),
  paymentStatus: z.boolean().default(false),
  paymentResponse: z.any(),
});

const ordersFilterSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid userId format")
    .optional(),

  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive integer",
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),

  status: z.enum(Object.values(ORDER_STATUS)).optional(),

  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid startDate format",
    }),

  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid endDate format",
    }),

  sortBy: z.enum(["status", "createdAt", "totalQuantity"]).optional(),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

const changeOrderStatusSchema = z.object({
  newStatus: z.enum(Object.values(ORDER_STATUS), {
    required_error: "New status is required.",
    invalid_type_error: "Invalid status value.",
  }),
  note: z
    .string({
      invalid_type_error: "Note must be a string.",
    })
    .optional(),
});

const cancelOrderByUserSchema = z.object({
  reason: z
    .string({
      invalid_type_error: "Reason must be a string.",
    })
    .optional(),
});

const shippingRateSchema = z.object({
  destination: z.object({
    address: z.object({
      suburb: z.string().trim(),
      postCode: z.string().trim(),
      city: z.string().trim(),
      countryCode: z
        .string()
        .length(2, { message: "Country code must be 2 characters" })
        .toUpperCase(),
    }),
  }),

  freightDetails: z
    .array(
      z.object({
        units: z.string().regex(/^\d+$/, "Units must be a valid integer"),
        packTypeCode: z.string().trim(),
        height: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Height must be a valid number"),
        length: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Length must be a valid number"),
        width: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Width must be a valid number"),
        weight: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Weight must be a valid number")
          .transform((val) => {
            const num = parseFloat(val);
            return Math.round(num).toString();
          }),
        volume: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Volume must be a valid number"),
      })
    )
    .min(1, { message: "At least one freight detail is required" }),
});

module.exports = {
  productSchema,
  updateProductSchema,
  productCategorySchema,
  updateInventorySchema,
  paymentResultSchema,
  orderSchema,
  ordersFilterSchema,
  changeOrderStatusSchema,
  cancelOrderByUserSchema,
  shippingRateSchema,
};

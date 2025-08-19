const { z } = require("zod");

const cartItemSchema = z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product Id." }),
    quantity: z.number({
        required_error: "Quantity is required.",
        invalid_type_error: "Quantity must be a number.",
    })
        .int("Quantity must be an integer.")
        .min(1, "Quantity must be at least 1."),
});

const syncCartSchema = z.object({
    localCart: z.array(
        cartItemSchema
    ).nonempty("Local cart cannot be empty."),
});

module.exports = {
    cartItemSchema,
    syncCartSchema,
};

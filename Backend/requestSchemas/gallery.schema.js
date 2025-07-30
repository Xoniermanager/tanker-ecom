const { z } = require("zod");

const imageSchema = z.object({
    type: z.literal("image").default("image"),
    source: z.string({
        required_error: "Image source is required.",
        invalid_type_error: "Image source must be a string.",
    }),
});

const baseGallerySchema = z.object({
    title: z
        .string({
            required_error: "Title is required.",
            invalid_type_error: "Title must be a string.",
        })
        .min(1, { message: "Title cannot be empty." }),
    tags: z.array(z.string()).default([]),
    image: imageSchema,
});

const bulkInsertGallerySchema = z.object({
    items: z.array(baseGallerySchema).min(1, {
        message: "At least one gallery item must be provided for insertion.",
    }),
});

const bulkUpdateGallerySchema = z.object({
    items: z.array(baseGallerySchema.extend({
        _id: z.string({
            required_error: "_id is required for updating gallery item.",
        }),
    })).min(1, {
        message: "At least one gallery item must be provided for update.",
    }),
});

const bulkDeleteGallerySchema = z.object({
    ids: z.array(z.string({
        required_error: "Each ID must be a string.",
        invalid_type_error: "Each ID must be a string.",
    })).min(1, {
        message: "At least one ID must be provided for deletion.",
    }),
});

module.exports = {
    bulkInsertGallerySchema,
    bulkUpdateGallerySchema,
    bulkDeleteGallerySchema
};

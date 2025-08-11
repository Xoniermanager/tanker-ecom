const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const thumbnailSchema = z
    .object({
        type: z.enum(["video", "image"]),
        source: z.string(),
    })
    .optional();

const seoSchema = z
    .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        keywords: z.array(z.string()).optional(),
    })
    .optional();

const upsertBlogSchema = z.object({
    slug: z.string().optional(),
    title: z.string().min(1, { message: "Title is required." }),
    subtitle: z.string(),
    thumbnail: thumbnailSchema,
    tags: z.array(z.string()),
    categories: z.array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ObjectId format." })
    ).min(1, { message: "At least one category is required." }),
    content: z.unknown().refine((val) => !!val, {
        message: "Content is required.",
    }),
    seo: seoSchema,
    isPublished: z.boolean().optional(),
    publishedAt: z.coerce.date().optional(),
});

const setPublishStatusSchema = z.object({
    publish: z.boolean({
        required_error: "Publish flag is required.",
        invalid_type_error: "Publish must be a boolean.",
    }),
});

const filterBlogSchema = z.object({
    title: z.string().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    categories: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .refine(
            (val) => {
                if (!val) return true;

                if (Array.isArray(val)) {
                    return val.every((id) => objectIdRegex.test(id));
                }

                return objectIdRegex.test(val);
            },
            {
                message: 'All category IDs must be valid ObjectId strings.',
            }
        ),
});

const categorySchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
})

module.exports = {
    upsertBlogSchema,
    setPublishStatusSchema,
    filterBlogSchema,
    categorySchema,
};

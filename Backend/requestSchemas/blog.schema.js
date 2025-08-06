const { z } = require("zod");

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
    categories: z.array(z.string()).optional(),
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
    categories: z.union([z.string(), z.array(z.string())]).optional(),
});

const categorySchema = z.object({
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
})

module.exports = {
    upsertBlogSchema,
    setPublishStatusSchema,
    filterBlogSchema,
    categorySchema,
};
